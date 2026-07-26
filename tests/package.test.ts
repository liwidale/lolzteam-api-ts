/**
 * tests/package.test.ts
 * ---------------------
 * Packaging invariants that are easy to break and expensive to discover after
 * a release.
 */

import * as fs from "fs";
import * as path from "path";

import * as sdk from "../src/index.js";
import { VERSION } from "../src/version.js";

const root = path.resolve(__dirname, "..");

interface PackageManifest {
  name: string;
  version: string;
  main: string;
  module: string;
  types: string;
  files: string[];
  exports: Record<string, Record<string, string> | string>;
  engines: { node: string };
  dependencies?: Record<string, string>;
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf-8")
) as PackageManifest;

describe("package manifest", () => {
  test("is published under the expected name", () => {
    expect(manifest.name).toBe("lolzteam-api-ts");
  });

  test("keeps src/version.ts in sync", () => {
    expect(VERSION).toBe(manifest.version);
  });

  test("has no runtime dependencies", () => {
    expect(manifest.dependencies).toBeUndefined();
  });

  test("declares types before the runtime conditions", () => {
    const root_ = manifest.exports["."] as Record<string, string>;
    expect(Object.keys(root_)).toEqual(["types", "import", "require", "default"]);
  });

  test("ships the documentation alongside dist", () => {
    expect(manifest.files).toContain("dist");
    expect(manifest.files).toContain("README.md");
    expect(manifest.files).toContain("README.ru.md");
    expect(manifest.files).toContain("LICENSE");
  });

  test("requires a runtime with a global fetch", () => {
    expect(manifest.engines.node).toBe(">=18.0.0");
  });
});

describe("public API surface", () => {
  test("exports the clients", () => {
    expect(typeof sdk.Forum).toBe("function");
    expect(typeof sdk.Market).toBe("function");
    expect(typeof sdk.LolzteamClient).toBe("function");
    expect(typeof sdk.BaseClient).toBe("function");
  });

  test("exports the error types", () => {
    expect(typeof sdk.LolzteamError).toBe("function");
    expect(typeof sdk.LolzteamTimeoutError).toBe("function");
    expect(typeof sdk.LolzteamAbortError).toBe("function");
    expect(typeof sdk.LolzteamNetworkError).toBe("function");
  });

  test("exports the base URLs", () => {
    expect(sdk.FORUM_BASE_URL).toBe("https://prod-api.lolz.live");
    expect(sdk.MARKET_BASE_URL).toBe("https://prod-api.lzt.market");
    expect(sdk.FORUM_MIRRORS.length).toBeGreaterThan(1);
    expect(sdk.MARKET_MIRRORS.length).toBeGreaterThan(1);
  });

  test("exports the version constant", () => {
    expect(sdk.VERSION).toBe(VERSION);
  });

  test("error types form a single hierarchy", () => {
    const timeout = new sdk.LolzteamTimeoutError("GET", "/x", 10);
    expect(timeout).toBeInstanceOf(sdk.LolzteamError);
    expect(timeout).toBeInstanceOf(Error);
    expect(timeout.name).toBe("LolzteamTimeoutError");
  });
});

describe("source layout", () => {
  test("every relative import in src carries a file extension", () => {
    const offenders: string[] = [];

    const walk = (directory: string): void => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!entry.name.endsWith(".ts")) continue;
        const source = fs.readFileSync(full, "utf-8");
        for (const match of source.matchAll(/\bfrom\s+"(\.[^"]*)"/g)) {
          if (!match[1].endsWith(".js")) {
            offenders.push(`${path.relative(root, full)}: ${match[1]}`);
          }
        }
      }
    };

    walk(path.join(root, "src"));
    expect(offenders).toEqual([]);
  });
});
