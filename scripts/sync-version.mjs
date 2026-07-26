/**
 * scripts/sync-version.mjs
 * ------------------------
 * Rewrite src/version.ts from the version in package.json.
 *
 * Wired to the npm `version` lifecycle script, so `npm version patch` keeps the
 * exported VERSION constant in step automatically. tests/package.test.ts fails
 * when the two drift, which is what makes this worth automating.
 *
 * Safe to run at any time:
 *   node scripts/sync-version.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const target = join(root, "src", "version.ts");

const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const { version } = manifest;

if (typeof version !== "string" || !/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(version)) {
  throw new Error(`package.json has an unusable version field: ${JSON.stringify(version)}`);
}

const contents = `/**
 * Package version.
 *
 * Generated from package.json by scripts/sync-version.mjs, which runs on the
 * npm \`version\` lifecycle hook. Do not edit by hand: run \`npm version patch\`
 * instead, or \`node scripts/sync-version.mjs\` to resynchronize.
 */
export const VERSION = ${JSON.stringify(version)};
`;

const previous = await readFile(target, "utf8").catch(() => "");
if (previous === contents) {
  process.stdout.write(`src/version.ts already at ${version}\n`);
} else {
  await writeFile(target, contents, "utf8");
  process.stdout.write(`src/version.ts set to ${version}\n`);
}
