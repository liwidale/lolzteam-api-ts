/**
 * scripts/clean.mjs
 * -----------------
 * Remove build output. Kept as a script so that the project needs no extra
 * cross-platform dependency such as rimraf.
 */
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const targets = ["dist", "coverage"];

for (const target of targets) {
  await rm(join(root, target), { recursive: true, force: true });
}

process.stdout.write(`Removed: ${targets.join(", ")}\n`);
