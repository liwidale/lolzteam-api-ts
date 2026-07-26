#!/usr/bin/env ts-node
/**
 * codegen/generate.ts
 * -------------------
 * OpenAPI 3.1 document to TypeScript API wrapper generator.
 *
 * The generated classes expose one method per operation. Method parameters use
 * idiomatic camelCase names, and every method translates them back to the exact
 * wire names declared in the OpenAPI document before the request is sent. That
 * translation is what makes the SDK actually work against the LOLZTEAM APIs,
 * whose parameters are snake_case and sometimes bracketed (`prefix_ids[]`).
 *
 * Usage:
 *   npx ts-node codegen/generate.ts \
 *     --schema codegen/schemas/forum.json \
 *     --output src/forum/_generated.ts \
 *     --class ForumAPI
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// OpenAPI subset
// ---------------------------------------------------------------------------

export interface OpenAPISpec {
  openapi?: string;
  info?: { title?: string; version?: string };
  servers?: Array<{ url: string; description?: string }>;
  paths: Record<string, PathItem>;
  components?: Record<string, Record<string, unknown>>;
}

interface PathItem {
  parameters?: Array<ParameterObject | RefObject>;
  get?: OperationObject;
  post?: OperationObject;
  put?: OperationObject;
  patch?: OperationObject;
  delete?: OperationObject;
}

interface OperationObject {
  operationId?: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters?: Array<ParameterObject | RefObject>;
  requestBody?: RequestBodyObject | RefObject;
}

interface ParameterObject {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required?: boolean;
  deprecated?: boolean;
  description?: string;
  style?: string;
  explode?: boolean;
  schema?: SchemaObject;
}

interface RefObject {
  $ref: string;
}

interface RequestBodyObject {
  required?: boolean;
  description?: string;
  content?: Record<string, { schema?: SchemaObject }>;
}

interface SchemaObject {
  type?: string | string[];
  format?: string;
  $ref?: string;
  title?: string;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  items?: SchemaObject;
  anyOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  allOf?: SchemaObject[];
  enum?: Array<string | number | boolean | null>;
  const?: string | number | boolean | null;
  description?: string;
  deprecated?: boolean;
  default?: unknown;
  "x-enumDescriptions"?: Record<string, string>;
}

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

// ---------------------------------------------------------------------------
// Identifier helpers
// ---------------------------------------------------------------------------

/** Reserved words that cannot be used as a bare identifier. */
const TS_KEYWORDS = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally",
  "for", "function", "if", "import", "in", "instanceof", "new", "null",
  "return", "super", "switch", "this", "throw", "true", "try", "typeof", "var",
  "void", "while", "with", "as", "implements", "interface", "let", "package",
  "private", "protected", "public", "static", "yield", "type", "from", "of",
  "get", "set", "await", "async", "any", "boolean", "number", "string",
  "symbol", "object", "never", "unknown", "declare", "abstract", "readonly",
  "infer", "keyof", "is", "namespace", "module", "require", "global",
]);

/**
 * Members already defined by `BaseClient`, by the `Forum` and `Market`
 * shorthands, or by `Object.prototype`. A generated method whose name lands
 * here gets a trailing underscore so that nothing is shadowed.
 */
const RESERVED_MEMBERS = new Set([
  // BaseClient
  "constructor", "http", "token", "language", "proxy", "baseUrl", "request",
  // Forum and Market shorthands
  "me", "usersGet", "threadsList", "postsCreate", "getItem", "getPayments",
  "transfer",
  // Object.prototype and thenable protocol
  "toString", "valueOf", "hasOwnProperty", "isPrototypeOf",
  "propertyIsEnumerable", "toLocaleString", "then", "catch", "finally",
]);

/** Convert a wire name into a safe camelCase TypeScript identifier. */
function safeName(name: string): string {
  let camel = name
    .replace(/[-_.\s]+(.)/g, (_match, char: string) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9_$]/g, "_");
  if (camel.length === 0) camel = "_";
  if (/^\d/.test(camel)) camel = `_${camel}`;
  if (TS_KEYWORDS.has(camel)) camel = `${camel}_`;
  return camel;
}

/** Convert an operationId such as `Users.Get` into `Users_Get`. */
function methodNameFrom(operationId: string): string {
  const cleaned = operationId
    .replace(/[.\-\s/]+/g, "_")
    .replace(/[^a-zA-Z0-9_$]/g, "");
  const name = /^\d/.test(cleaned) ? `_${cleaned}` : cleaned;
  return name.length > 0 ? name : "operation";
}

/** Fallback method name when an operation has no operationId. */
function methodNameFromPath(urlPath: string, httpMethod: string): string {
  const parts = urlPath
    .split("/")
    .filter(Boolean)
    .map((segment) => (segment.startsWith("{") ? `By_${segment.slice(1, -1)}` : segment));
  return methodNameFrom([httpMethod, ...parts].join("_"));
}

/** True when a string can be used as an unquoted object key. */
function isPlainIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
}

function quote(value: string): string {
  return JSON.stringify(value);
}

// ---------------------------------------------------------------------------
// Reference resolution
// ---------------------------------------------------------------------------

function resolveRef<T>(ref: string, spec: OpenAPISpec): T | undefined {
  if (!ref.startsWith("#/")) return undefined;
  const parts = ref
    .slice(2)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
  let node: unknown = spec;
  for (const part of parts) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node as T | undefined;
}

function deref<T extends { $ref?: string }>(value: T, spec: OpenAPISpec): T | undefined {
  if (!value.$ref) return value;
  const resolved = resolveRef<T>(value.$ref, spec);
  if (!resolved) return undefined;
  return resolved.$ref ? deref(resolved, spec) : resolved;
}

// ---------------------------------------------------------------------------
// Type mapping
// ---------------------------------------------------------------------------

const MAX_TYPE_DEPTH = 5;

function literal(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "string") return quote(value);
  return String(value);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function unionOf(members: string[]): string {
  const cleaned = unique(members.filter((member) => member.length > 0));
  if (cleaned.length === 0) return "unknown";
  if (cleaned.includes("unknown")) return "unknown";
  return cleaned.join(" | ");
}

/** Map an OpenAPI schema onto a TypeScript type expression. */
function tsType(schema: SchemaObject | undefined, spec: OpenAPISpec, depth = 0): string {
  if (!schema || depth > MAX_TYPE_DEPTH) return "unknown";

  if (schema.$ref) {
    const resolved = deref(schema, spec);
    if (!resolved || resolved === schema) return "unknown";
    return tsType(resolved, spec, depth + 1);
  }

  if (schema.const !== undefined) return literal(schema.const);

  if (schema.enum && schema.enum.length > 0) {
    return unionOf(schema.enum.map(literal));
  }

  if (schema.oneOf) return unionOf(schema.oneOf.map((s) => tsType(s, spec, depth + 1)));
  if (schema.anyOf) return unionOf(schema.anyOf.map((s) => tsType(s, spec, depth + 1)));
  if (schema.allOf) {
    const members = schema.allOf
      .map((s) => tsType(s, spec, depth + 1))
      .filter((member) => member !== "unknown");
    return members.length > 0 ? members.join(" & ") : "Record<string, unknown>";
  }

  if (Array.isArray(schema.type)) {
    return unionOf(
      schema.type.map((type) => tsType({ ...schema, type, enum: undefined }, spec, depth + 1))
    );
  }

  if (schema.format === "binary") return "BinaryInput";

  switch (schema.type) {
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "string":
      return "string";
    case "null":
      return "null";
    case "array": {
      const item = tsType(schema.items, spec, depth + 1);
      return item.includes("|") || item.includes("&") ? `Array<${item}>` : `${item}[]`;
    }
    case "object":
      return "Record<string, unknown>";
    default:
      return "unknown";
  }
}

// ---------------------------------------------------------------------------
// Documentation helpers
// ---------------------------------------------------------------------------

function sanitizeDoc(text: string): string[] {
  return text
    .replace(/\*\//g, "*\\/")
    // Normalize dashes in prose. Enum values and wire names are never routed
    // through this function, so no transmitted value is affected.
    .replace(/[—–]/g, "-")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""));
}

function docBlock(indent: string, paragraphs: string[]): string[] {
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph === "") {
      if (lines.length > 0) lines.push("");
      continue;
    }
    lines.push(...sanitizeDoc(paragraph));
  }
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  if (lines.length === 0) return [];
  if (lines.length === 1) return [`${indent}/** ${lines[0]} */`];
  return [
    `${indent}/**`,
    ...lines.map((line) => (line === "" ? `${indent} *` : `${indent} * ${line}`)),
    `${indent} */`,
  ];
}

/** Build the documentation paragraphs for a single parameter. */
function fieldDoc(field: Field, spec: OpenAPISpec): string[] {
  const paragraphs: string[] = [];
  if (field.description) paragraphs.push(field.description);

  const schema = field.schema?.$ref ? deref(field.schema, spec) : field.schema;
  const enumDescriptions = schema?.["x-enumDescriptions"];
  if (enumDescriptions && Object.keys(enumDescriptions).length > 0) {
    paragraphs.push("");
    for (const key of Object.keys(enumDescriptions)) {
      paragraphs.push(`- \`${key}\`: ${enumDescriptions[key]}`);
    }
  }

  if (schema?.default !== undefined) {
    paragraphs.push("");
    paragraphs.push(`@defaultValue \`${JSON.stringify(schema.default)}\``);
  }
  if (field.deprecated) {
    paragraphs.push("");
    paragraphs.push("@deprecated");
  }
  if (field.wire !== field.ts) {
    paragraphs.push("");
    paragraphs.push(`Sent as \`${field.wire}\`.`);
  }
  return paragraphs;
}

// ---------------------------------------------------------------------------
// Operation model
// ---------------------------------------------------------------------------

type FieldSource = "path" | "query" | "body";

interface Field {
  /** TypeScript parameter name. */
  ts: string;
  /** Name expected by the API. */
  wire: string;
  source: FieldSource;
  required: boolean;
  csv: boolean;
  type: string;
  description?: string;
  deprecated?: boolean;
  schema?: SchemaObject;
}

type BodyKind = "json" | "form" | "data";

interface Operation {
  methodName: string;
  httpMethod: string;
  urlPath: string;
  summary?: string;
  description?: string;
  deprecated: boolean;
  fields: Field[];
  bodyKind: BodyKind;
}

/** Collect path level and operation level parameters, later ones winning. */
function collectParameters(
  operation: OperationObject,
  pathItem: PathItem,
  spec: OpenAPISpec
): ParameterObject[] {
  const merged = new Map<string, ParameterObject>();
  const add = (raw: ParameterObject | RefObject): void => {
    const parameter = deref(raw as ParameterObject & RefObject, spec);
    if (!parameter?.name || !parameter.in) return;
    if (parameter.in !== "path" && parameter.in !== "query") return;
    merged.set(`${parameter.in}:${parameter.name}`, parameter);
  };
  (pathItem.parameters ?? []).forEach(add);
  (operation.parameters ?? []).forEach(add);
  return [...merged.values()];
}

interface FlatBody {
  /** Every variant seen for a property, in declaration order. */
  properties: Map<string, SchemaObject[]>;
  required: Set<string>;
}

function addVariant(target: Map<string, SchemaObject[]>, name: string, schema: SchemaObject): void {
  const variants = target.get(name);
  if (!variants) {
    target.set(name, [schema]);
    return;
  }
  const fingerprint = JSON.stringify(schema);
  if (!variants.some((variant) => JSON.stringify(variant) === fingerprint)) {
    variants.push(schema);
  }
}

/**
 * Flatten a request body schema into a property list.
 *
 * `oneOf` and `anyOf` bodies (the OAuth token endpoint, for example) are merged
 * into a single signature: the union of every property, required only when it
 * is required in every branch. When branches declare the same property with
 * different schemas, the resulting type is the union of those schemas.
 */
function flattenBodySchema(schema: SchemaObject | undefined, spec: OpenAPISpec): FlatBody {
  const properties = new Map<string, SchemaObject[]>();
  const required = new Set<string>();
  if (!schema) return { properties, required };

  const resolved = schema.$ref ? deref(schema, spec) : schema;
  if (!resolved) return { properties, required };

  for (const [name, propertySchema] of Object.entries(resolved.properties ?? {})) {
    addVariant(properties, name, propertySchema);
  }
  for (const name of resolved.required ?? []) required.add(name);

  if (resolved.allOf) {
    for (const branch of resolved.allOf) {
      const flat = flattenBodySchema(branch, spec);
      flat.properties.forEach((variants, name) => {
        for (const variant of variants) addVariant(properties, name, variant);
      });
      flat.required.forEach((name) => required.add(name));
    }
  }

  const branches = resolved.oneOf ?? resolved.anyOf;
  if (branches && branches.length > 0) {
    const flattened = branches.map((branch) => flattenBodySchema(branch, spec));
    for (const flat of flattened) {
      flat.properties.forEach((variants, name) => {
        for (const variant of variants) addVariant(properties, name, variant);
      });
    }
    // A property is required only when every branch requires it.
    const [first, ...rest] = flattened;
    for (const name of first.required) {
      if (rest.every((flat) => flat.required.has(name))) required.add(name);
    }
  }

  return { properties, required };
}

/** Collapse the variants collected for a property into one schema. */
function combineVariants(variants: SchemaObject[]): SchemaObject {
  if (variants.length === 1) return variants[0];
  const combined: SchemaObject = { anyOf: variants };
  const described = variants.find((variant) => variant.description);
  if (described?.description) combined.description = described.description;
  const deprecated = variants.every((variant) => variant.deprecated);
  if (deprecated) combined.deprecated = true;
  return combined;
}

function pickMediaType(
  content: Record<string, { schema?: SchemaObject }>
): { kind: BodyKind; schema: SchemaObject | undefined } | undefined {
  const json = content["application/json"];
  if (json) return { kind: "json", schema: json.schema };
  const urlencoded = content["application/x-www-form-urlencoded"];
  if (urlencoded) return { kind: "data", schema: urlencoded.schema };
  const multipart = content["multipart/form-data"];
  if (multipart) return { kind: "form", schema: multipart.schema };
  const first = Object.keys(content)[0];
  if (first) return { kind: "json", schema: content[first].schema };
  return undefined;
}

function buildOperation(
  urlPath: string,
  httpMethod: HttpMethod,
  operation: OperationObject,
  pathItem: PathItem,
  spec: OpenAPISpec,
  usedMethodNames: Map<string, number>
): Operation {
  const rawName = operation.operationId
    ? methodNameFrom(operation.operationId)
    : methodNameFromPath(urlPath, httpMethod);
  const baseName = RESERVED_MEMBERS.has(rawName) ? `${rawName}_` : rawName;

  const seen = usedMethodNames.get(baseName) ?? 0;
  usedMethodNames.set(baseName, seen + 1);
  const methodName = seen === 0 ? baseName : `${baseName}_${seen + 1}`;

  const usedFieldNames = new Set<string>();
  const uniqueField = (wire: string): string => {
    let candidate = safeName(wire);
    let counter = 2;
    while (usedFieldNames.has(candidate)) {
      candidate = `${safeName(wire)}_${counter}`;
      counter += 1;
    }
    usedFieldNames.add(candidate);
    return candidate;
  };

  const fields: Field[] = [];
  const parameters = collectParameters(operation, pathItem, spec);

  const pushParameter = (parameter: ParameterObject, source: "path" | "query"): void => {
    const schema = parameter.schema;
    const resolved = schema?.$ref ? deref(schema, spec) : schema;
    const isArray = resolved?.type === "array";
    const field: Field = {
      ts: uniqueField(parameter.name),
      wire: parameter.name,
      source,
      required: source === "path" ? true : parameter.required === true,
      csv: isArray === true && parameter.explode === false,
      type: tsType(schema, spec),
    };
    if (parameter.description) field.description = parameter.description;
    if (parameter.deprecated) field.deprecated = true;
    if (schema) field.schema = schema;
    fields.push(field);
  };

  for (const parameter of parameters) {
    if (parameter.in === "path") pushParameter(parameter, "path");
  }
  for (const parameter of parameters) {
    if (parameter.in === "query") pushParameter(parameter, "query");
  }

  let bodyKind: BodyKind = "json";
  const requestBody = operation.requestBody
    ? deref(operation.requestBody as RequestBodyObject & RefObject, spec)
    : undefined;

  if (requestBody?.content) {
    const media = pickMediaType(requestBody.content);
    if (media) {
      bodyKind = media.kind;
      const { properties, required } = flattenBodySchema(media.schema, spec);
      properties.forEach((variants, name) => {
        const propertySchema = combineVariants(variants);
        const field: Field = {
          ts: uniqueField(name),
          wire: name,
          source: "body",
          required: required.has(name),
          csv: false,
          type: tsType(propertySchema, spec),
          schema: propertySchema,
        };
        if (propertySchema.description) field.description = propertySchema.description;
        if (propertySchema.deprecated) field.deprecated = true;
        fields.push(field);
      });
    }
  }

  const result: Operation = {
    methodName,
    httpMethod: httpMethod.toUpperCase(),
    urlPath,
    deprecated: operation.deprecated === true,
    fields,
    bodyKind,
  };
  if (operation.summary) result.summary = operation.summary;
  if (operation.description) result.description = operation.description;
  return result;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderPick(indent: string, key: string, fields: Field[]): string[] {
  const lines = [`${indent}${key}: this._pick(params, {`];
  for (const field of fields) {
    const name = isPlainIdentifier(field.ts) ? field.ts : quote(field.ts);
    const value = field.csv ? `[${quote(field.wire)}, "csv"]` : quote(field.wire);
    lines.push(`${indent}  ${name}: ${value},`);
  }
  lines.push(`${indent}}),`);
  return lines;
}

function renderPathLiteral(operation: Operation): string {
  const pathFields = operation.fields.filter((field) => field.source === "path");
  if (pathFields.length === 0) return quote(operation.urlPath);
  let template = operation.urlPath;
  for (const field of pathFields) {
    template = template.split(`{${field.wire}}`).join(`\${this._seg(params.${field.ts})}`);
  }
  return `\`${template.replace(/`/g, "\\`")}\``;
}

function renderMethod(operation: Operation, spec: OpenAPISpec): string[] {
  const lines: string[] = [];

  const header: string[] = [];
  if (operation.summary) header.push(operation.summary);
  if (operation.description && operation.description !== operation.summary) {
    header.push("");
    header.push(operation.description);
  }
  header.push("");
  header.push(`\`${operation.httpMethod} ${operation.urlPath}\``);
  if (operation.deprecated) {
    header.push("");
    header.push("@deprecated");
  }
  lines.push(...docBlock("  ", header));

  const required = operation.fields.filter((field) => field.required);
  const optional = operation.fields.filter((field) => !field.required);
  const ordered = [...required, ...optional];

  if (ordered.length === 0) {
    lines.push(`  ${operation.methodName}(): Promise<Response> {`);
  } else {
    lines.push(`  ${operation.methodName}(params: {`);
    for (const field of ordered) {
      lines.push(...docBlock("    ", fieldDoc(field, spec)));
      lines.push(`    ${field.ts}${field.required ? "" : "?"}: ${field.type};`);
    }
    const defaulted = required.length === 0 ? " = {}" : "";
    lines.push(`  }${defaulted}): Promise<Response> {`);
  }

  const queryFields = operation.fields.filter((field) => field.source === "query");
  const bodyFields = operation.fields.filter((field) => field.source === "body");
  const pathLiteral = renderPathLiteral(operation);

  const parts: string[] = [];
  if (queryFields.length > 0) {
    parts.push(...renderPick("      ", "params", queryFields));
  }
  if (bodyFields.length > 0) {
    parts.push(...renderPick("      ", operation.bodyKind, bodyFields));
  }

  if (parts.length === 0) {
    lines.push(`    return this._request(${quote(operation.httpMethod)}, ${pathLiteral});`);
  } else {
    lines.push(`    return this._request(${quote(operation.httpMethod)}, ${pathLiteral}, {`);
    lines.push(...parts);
    lines.push("    });");
  }

  lines.push("  }");
  return lines;
}

// ---------------------------------------------------------------------------
// Generator entry point
// ---------------------------------------------------------------------------

export function renderModule(spec: OpenAPISpec, className: string, schemaName: string): string {
  const usedMethodNames = new Map<string, number>();
  const operations: Operation[] = [];

  for (const [urlPath, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const httpMethod of HTTP_METHODS) {
      const operation = pathItem[httpMethod];
      if (!operation) continue;
      operations.push(
        buildOperation(urlPath, httpMethod, operation, pathItem, spec, usedMethodNames)
      );
    }
  }

  const needsBinary = operations.some((operation) =>
    operation.fields.some((field) => field.type.includes("BinaryInput"))
  );

  const header = [
    "/* eslint-disable */",
    "/**",
    " * THIS FILE IS AUTO-GENERATED. DO NOT EDIT.",
    " *",
    ` * Source document: codegen/schemas/${schemaName}`,
    ` * Regenerate with: npm run codegen`,
    " */",
    "",
    'import { BaseClient } from "../core/base.js";',
  ];
  if (needsBinary) {
    header.push('import type { BinaryInput } from "../core/client.js";');
  }
  header.push("", `export class ${className} extends BaseClient {`);

  const body: string[] = [];
  for (const operation of operations) {
    body.push(...renderMethod(operation, spec));
    body.push("");
  }
  if (body.length > 0) body.pop();

  return [...header, ...body, "}", ""].join("\n");
}

function generate(schemaPath: string, outputPath: string, className: string): void {
  const spec = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as OpenAPISpec;
  const source = renderModule(spec, className, path.basename(schemaPath));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, source, "utf-8");

  const methodCount = (source.match(/^ {2}[A-Za-z_$][\w$]*\(/gm) ?? []).length;
  process.stdout.write(`Generated ${methodCount} methods into ${outputPath}\n`);
}

function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) continue;
    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) continue;
    result[current.slice(2)] = next;
    index += 1;
  }
  return result;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (!args.schema || !args.output || !args.class) {
    process.stderr.write(
      "Usage: ts-node codegen/generate.ts --schema <file> --output <file> --class <Name>\n"
    );
    process.exit(1);
    return;
  }
  generate(args.schema, args.output, args.class);
}

if (require.main === module) {
  main();
}
