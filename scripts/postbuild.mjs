/**
 * scripts/postbuild.mjs
 * ---------------------
 * Finalize the dual CommonJS / ES module build.
 *
 * The root package is `"type": "commonjs"`, so every emitted `.js` file is
 * treated as CommonJS by Node. Dropping a tiny `package.json` into each output
 * directory flips `dist/esm` over to real ES modules while keeping `dist/cjs`
 * explicit. This is the standard way to publish a dual package without
 * renaming files to `.cjs` and `.mjs`.
 *
 * The script also verifies that the entry points exist and that every relative
 * import in the ESM output carries a file extension, which Node requires.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, relative } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const packageMarkers = [
  ["cjs", { type: "commonjs" }],
  ["esm", { type: "module" }],
];

for (const [directory, contents] of packageMarkers) {
  const target = join(dist, directory);
  if (!existsSync(target)) {
    throw new Error(`Missing build output: ${relative(root, target)}`);
  }
  await writeFile(join(target, "package.json"), `${JSON.stringify(contents, null, 2)}\n`, "utf8");
}

const entryPoints = [
  "dist/cjs/index.js",
  "dist/esm/index.js",
  "dist/types/index.d.ts",
];

for (const entry of entryPoints) {
  const target = join(root, entry);
  const info = await stat(target).catch(() => null);
  if (!info || !info.isFile()) {
    throw new Error(`Missing build entry point: ${entry}`);
  }
}

async function walk(directory) {
  const results = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) {
      results.push(...(await walk(full)));
    } else {
      results.push(full);
    }
  }
  return results;
}

const RELATIVE_IMPORT = /\bfrom\s+["'](\.[^"']*)["']/g;
const problems = [];

for (const file of await walk(join(dist, "esm"))) {
  if (extname(file) !== ".js") continue;
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(RELATIVE_IMPORT)) {
    if (!match[1].endsWith(".js")) {
      problems.push(`${relative(root, file)}: "${match[1]}" has no file extension`);
    }
  }
}

if (problems.length > 0) {
  throw new Error(
    `ES module output contains extensionless relative imports, which Node cannot resolve:\n  ${problems.join("\n  ")}`
  );
}

process.stdout.write("Build finalized: dist/cjs (CommonJS), dist/esm (ES modules), dist/types\n");
