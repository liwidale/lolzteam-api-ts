/**
 * scripts/smoke.cjs
 * -----------------
 * Consumer side smoke test.
 *
 * Runs from a throwaway project that installed the packed tarball, so it
 * exercises what users actually get: the exports map, both module formats, the
 * type declarations and the wire format produced by a generated method.
 *
 * It deliberately does not import from a relative path. Everything is resolved
 * through the package name, which is what catches a broken `exports` map, a
 * file missing from the `files` list, or a dependency that only resolves under
 * the flat node_modules layout that npm and yarn use but pnpm does not.
 *
 *   node smoke.cjs
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const PACKAGE = "lolzteam-api-ts";

async function main() {
  // CommonJS entry point.
  const cjs = require(PACKAGE);
  assert.equal(typeof cjs.Forum, "function", "CommonJS build must export Forum");
  assert.equal(typeof cjs.Market, "function", "CommonJS build must export Market");
  assert.equal(typeof cjs.LolzteamClient, "function", "CommonJS build must export LolzteamClient");
  assert.equal(typeof cjs.VERSION, "string", "CommonJS build must export VERSION");

  // ES module entry point. A dynamic import from CommonJS resolves the
  // "import" condition, so this loads dist/esm rather than dist/cjs.
  const esm = await import(PACKAGE);
  assert.equal(typeof esm.Forum, "function", "ES module build must export Forum");
  assert.equal(typeof esm.Market, "function", "ES module build must export Market");
  assert.equal(esm.VERSION, cjs.VERSION, "both builds must report the same version");

  // Type declarations must be present and reachable through the exports map.
  const manifestPath = require.resolve(`${PACKAGE}/package.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const types = manifest.exports["."].types;
  assert.ok(types, "the exports map must declare a types condition");
  assert.ok(
    fs.existsSync(path.join(path.dirname(manifestPath), types)),
    `declaration file is missing from the published package: ${types}`
  );

  // The generated methods must be real prototype methods, not per instance
  // closures, otherwise declarations and instanceof stop behaving.
  const forum = new cjs.Forum({ token: "smoke", delayMs: 0 });
  assert.ok(forum instanceof cjs.Forum, "Forum instances must satisfy instanceof");
  assert.equal(typeof forum.Users_Get, "function", "Forum must expose generated methods");
  assert.equal(typeof forum.Threads_Create, "function", "Forum must expose generated methods");

  const market = new cjs.Market({ token: "smoke", delayMs: 0 });
  assert.equal(typeof market.Managing_Get, "function", "Market must expose generated methods");

  // End to end wire format check. This is the behaviour the whole package
  // exists for: camelCase in, snake_case and bracketed arrays out.
  const calls = [];
  cjs._setFetch(async (url, init) => {
    calls.push({ url, method: init.method, body: init.body });
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  });

  await forum.Threads_Create({ postBody: "hi", forumId: 876, hideContacts: true });
  assert.deepEqual(
    JSON.parse(calls[0].body),
    { post_body: "hi", forum_id: 876, hide_contacts: true },
    "request bodies must use the names the API expects"
  );

  await forum.Threads_List({ forumId: 876, prefixIds__: [1, 2] });
  const query = new URL(calls[1].url).searchParams;
  assert.equal(query.get("forum_id"), "876", "query parameters must be snake_case");
  assert.deepEqual(
    query.getAll("prefix_ids[]"),
    ["1", "2"],
    "bracketed array parameters must be repeated, not comma joined"
  );

  await market.Managing_Get({ itemId: 42, parseSameItemIds: true });
  const itemUrl = new URL(calls[2].url);
  assert.equal(itemUrl.pathname, "/42", "path parameters must be interpolated into the URL");
  assert.equal(itemUrl.searchParams.has("item_id"), false, "path parameters must not leak into the query");

  cjs._resetFetch();

  console.log(`smoke passed: ${PACKAGE}@${cjs.VERSION}, ${calls.length} requests verified`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
