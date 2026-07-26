/**
 * tests/codegen.test.ts
 * ---------------------
 * Guards the generator itself and the freshness of its output.
 */

import * as fs from "fs";
import * as path from "path";

import { renderModule } from "../codegen/generate.js";
import type { OpenAPISpec } from "../codegen/generate.js";

const root = path.resolve(__dirname, "..");

interface Target {
  label: string;
  schema: string;
  output: string;
  className: string;
}

const TARGETS: Target[] = [
  {
    label: "forum",
    schema: "codegen/schemas/forum.json",
    output: "src/forum/_generated.ts",
    className: "ForumAPI",
  },
  {
    label: "market",
    schema: "codegen/schemas/market.json",
    output: "src/market/_generated.ts",
    className: "MarketAPI",
  },
];

function readSpec(relative: string): OpenAPISpec {
  return JSON.parse(fs.readFileSync(path.join(root, relative), "utf-8")) as OpenAPISpec;
}

function countOperations(spec: OpenAPISpec): number {
  let total = 0;
  for (const pathItem of Object.values(spec.paths)) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      if (pathItem[method]) total += 1;
    }
  }
  return total;
}

describe.each(TARGETS)("$label module", (target) => {
  const spec = readSpec(target.schema);
  const generated = renderModule(spec, target.className, path.basename(target.schema));

  test("checked-in output matches the generator", () => {
    const onDisk = fs.readFileSync(path.join(root, target.output), "utf-8");
    expect(onDisk).toBe(generated);
  });

  test("covers every operation in the document", () => {
    const methods = generated.match(/^ {2}[A-Za-z_$][\w$]*\(/gm) ?? [];
    expect(methods).toHaveLength(countOperations(spec));
  });

  test("declares no duplicate method names", () => {
    const methods = (generated.match(/^ {2}([A-Za-z_$][\w$]*)\(/gm) ?? []).map((line) =>
      line.trim().replace("(", "")
    );
    expect(new Set(methods).size).toBe(methods.length);
  });

  test("emits no unresolved TypeScript syntax", () => {
    expect(generated).not.toContain("undefined:");
    expect(generated).not.toContain("[object Object]");
    expect(generated).not.toContain("${params.undefined}");
  });

  test("leaves no unsubstituted path placeholders in request calls", () => {
    const offenders = [...generated.matchAll(/this\._request\("[A-Z]+", (`[^`]*`|"[^"]*")/g)]
      .map((match) => match[1])
      .filter((literal) => /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(literal));

    expect(offenders).toEqual([]);
  });

  test("interpolates every path parameter through the segment encoder", () => {
    const templated = [...generated.matchAll(/this\._request\("[A-Z]+", `([^`]*)`/g)].map(
      (match) => match[1]
    );
    expect(templated.length).toBeGreaterThan(0);
    for (const template of templated) {
      expect(template).toContain("${this._seg(params.");
    }
  });
});

describe("wire name translation", () => {
  const spec = readSpec("codegen/schemas/forum.json");
  const generated = renderModule(spec, "ForumAPI", "forum.json");

  test("maps snake_case query parameters", () => {
    expect(generated).toContain('parentCategoryId: "parent_category_id"');
  });

  test("maps snake_case body properties", () => {
    expect(generated).toContain('postBody: "post_body"');
  });

  test("preserves bracketed array parameter names", () => {
    expect(generated).toContain('"prefix_ids[]"');
  });

  test("marks non-exploded arrays for comma joining", () => {
    expect(generated).toContain('["fields_include", "csv"]');
  });

  test("merges oneOf request bodies into one signature", () => {
    expect(generated).toContain(
      'grantType: "client_credentials" | "authorization_code" | "refresh_token" | "password"'
    );
  });

  test("routes multipart operations to the form body", () => {
    expect(generated).toContain("form: this._pick(params, {");
  });

  test("turns component enums into literal unions", () => {
    const market = renderModule(readSpec("codegen/schemas/market.json"), "MarketAPI", "market.json");
    expect(market).toContain('"rub" | "uah" | "kzt"');
  });
});

describe("generated module shape", () => {
  test("both modules extend BaseClient", () => {
    for (const target of TARGETS) {
      const source = fs.readFileSync(path.join(root, target.output), "utf-8");
      expect(source).toContain(`export class ${target.className} extends BaseClient {`);
      expect(source).toContain('import { BaseClient } from "../core/base.js";');
    }
  });

  test("every relative import carries a file extension", () => {
    for (const target of TARGETS) {
      const source = fs.readFileSync(path.join(root, target.output), "utf-8");
      for (const match of source.matchAll(/\bfrom\s+"(\.[^"]*)"/g)) {
        expect(match[1].endsWith(".js")).toBe(true);
      }
    }
  });
});
