# lolzteam-api-ts

TypeScript and JavaScript SDK for the LOLZTEAM **Forum** and **Market** APIs, generated from the official OpenAPI documents.

[Русская версия](README.ru.md)

[![npm](https://img.shields.io/npm/v/lolzteam-api-ts.svg)](https://www.npmjs.com/package/lolzteam-api-ts)
[![license](https://img.shields.io/npm/l/lolzteam-api-ts.svg)](LICENSE)
[![types](https://img.shields.io/badge/types-included-blue.svg)](https://www.typescriptlang.org/)

---

## Table of contents

- [Highlights](#highlights)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [How method and parameter names work](#how-method-and-parameter-names-work)
- [Client options](#client-options)
- [Changing settings at runtime](#changing-settings-at-runtime)
- [Working with responses](#working-with-responses)
- [Error handling](#error-handling)
- [Retries and rate limiting](#retries-and-rate-limiting)
- [Timeouts and cancellation](#timeouts-and-cancellation)
- [File uploads](#file-uploads)
- [Proxies](#proxies)
- [Raw requests](#raw-requests)
- [Browser usage](#browser-usage)
- [Full API reference](#full-api-reference)
- [Regenerating from OpenAPI documents](#regenerating-from-openapi-documents)
- [Development](#development)
- [Publishing to npm](#publishing-to-npm)
- [Project structure](#project-structure)
- [License](#license)

---

## Highlights

- **Complete coverage.** 151 Forum methods and 115 Market methods, generated straight from the official OpenAPI 3.1 documents.
- **Correct on the wire.** You write `parentCategoryId`, the SDK sends `parent_category_id`. Bracketed array parameters such as `prefix_ids[]` and comma joined parameters such as `fields_include` are handled for you.
- **Fully typed.** Enums become literal unions, every parameter carries its documentation, and editor autocomplete works out of the box.
- **Zero runtime dependencies.** Built on the global `fetch`, so it runs on Node.js 18+, Deno, Bun, Cloudflare Workers and modern browsers.
- **Dual package.** Ships CommonJS, ES modules and type declarations.
- **Production ready transport.** Automatic retries with exponential backoff and `Retry-After` support, request throttling, timeouts, cancellation and proxy support.

## Requirements

| Runtime | Version |
| --- | --- |
| Node.js | 18.0.0 or newer (global `fetch`) |
| TypeScript | 4.7 or newer (optional) |
| Browsers | Any browser with `fetch` and `AbortController` |

On older runtimes, supply your own `fetch` implementation through the `fetch` client option.

## Installation

```bash
npm install lolzteam-api-ts
```

```bash
yarn add lolzteam-api-ts
```

```bash
pnpm add lolzteam-api-ts
```

An HTTP proxy also requires the optional peer dependency:

```bash
npm install undici
```

## Quick start

```typescript
import { Forum, Market } from "lolzteam-api-ts";

const token = process.env.LOLZ_TOKEN!;

const forum = new Forum({ token });
const market = new Market({ token });

// Forum: read your own profile.
const profileResponse = await forum.me();
const profile = await profileResponse.json();
console.log(profile.user.username);

// Forum: list threads in a section.
const threadsResponse = await forum.Threads_List({ forumId: 876, limit: 10 });
const { threads } = await threadsResponse.json();

// Forum: create a post.
await forum.Posts_Create({ threadId: 123456, postBody: "Hello from TypeScript" });

// Market: read an item.
const itemResponse = await market.Managing_Get({ itemId: 12345678 });
const { item } = await itemResponse.json();

// Market: search Steam accounts.
const steamResponse = await market.Category_Steam({ pmin: 100, pmax: 500, origin__: ["brute"] });
const { items } = await steamResponse.json();
```

CommonJS works the same way:

```javascript
const { Forum, Market } = require("lolzteam-api-ts");

const forum = new Forum({ token: process.env.LOLZ_TOKEN });
```

## How method and parameter names work

The LOLZTEAM APIs use snake_case parameters, and a number of them are bracketed arrays. Writing that by hand is error prone, so the SDK exposes idiomatic camelCase names and converts them back before the request leaves your process.

| You write | The SDK sends |
| --- | --- |
| `parentCategoryId: 7` | `parent_category_id=7` |
| `postBody: "Hi"` | `{"post_body": "Hi"}` |
| `prefixIds__: [1, 2]` | `prefix_ids[]=1&prefix_ids[]=2` |
| `fieldsInclude: ["a", "b"]` | `fields_include=a,b` |
| `type_: "money_transfer"` | `type=money_transfer` |

Naming rules:

- **Method names** come from the `operationId` in the OpenAPI document, with dots replaced by underscores. `Users.Get` becomes `Users_Get`, `Threads.Poll.Vote` becomes `Threads_Poll_Vote`.
- **Parameter names** are the camelCase form of the wire name. Every parameter whose name changed says so in its documentation comment, for example "Sent as `parent_category_id`".
- Parameters that would collide with a TypeScript keyword get a trailing underscore, so `type` becomes `type_`.
- Bracketed parameters keep a trailing `__` in TypeScript because `[` and `]` are not valid in identifiers, so `origin[]` becomes `origin__`.
- Path parameters are interpolated into the URL and never leak into the query string or the body.

Hovering a method in your editor shows the summary, the HTTP route and the documentation for every parameter, including the meaning of each enum value.

## Client options

Both `Forum` and `Market` accept the same options.

```typescript
const forum = new Forum({
  token: "YOUR_TOKEN",
  language: "en",
  baseUrl: "https://prod-api.lolz.live",
  timeoutMs: 30_000,
  delayMs: 500,
  maxRetries: 5,
  retryStatuses: [429, 500, 502, 503, 504],
  userAgent: "my-app/1.0.0",
  proxy: "http://user:pass@127.0.0.1:8080",
  warnOnRetry: true,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `token` | `string` | required | Bearer token sent in the `Authorization` header. |
| `language` | `string` | `"en"` | Value of the `Accept-Language` header. Use `"ru"` for Russian responses. |
| `baseUrl` | `string` | see below | Overrides the API host. Useful for mirrors. |
| `timeoutMs` | `number` | `30000` | Per attempt timeout. |
| `delayMs` | `number` | `500` | Minimum delay between two consecutive requests from the same client. |
| `maxRetries` | `number` | `5` | Total attempts for retryable statuses. |
| `retryStatuses` | `number[]` | `[429, 500, 502, 503, 504]` | Statuses that trigger a retry. |
| `userAgent` | `string` | `lolzteam-api-ts/<version>` | Value of the `User-Agent` header. Browsers ignore it. |
| `proxy` | `string` | none | HTTP or HTTPS proxy URL. Node.js only, requires `undici`. |
| `dispatcher` | `unknown` | none | Pre-built undici dispatcher. Takes precedence over `proxy`. |
| `fetch` | `FetchLike` | global `fetch` | Custom transport implementation. |
| `warnOnRetry` | `boolean` | `true` | Log a warning before each retry. |

Default hosts and their mirrors are exported as constants:

```typescript
import { FORUM_BASE_URL, FORUM_MIRRORS, MARKET_BASE_URL, MARKET_MIRRORS } from "lolzteam-api-ts";

FORUM_BASE_URL;  // "https://prod-api.lolz.live"
FORUM_MIRRORS;   // prod-api.lolz.live, prod-api.zelenka.guru, api.lolz.live, api.zelenka.guru
MARKET_BASE_URL; // "https://prod-api.lzt.market"
MARKET_MIRRORS;  // prod-api.lzt.market, api.lzt.market
```

## Changing settings at runtime

Token, language, proxy and base URL are plain accessors, so you can rotate them without building a new client.

```typescript
const forum = new Forum({ token: "first-token" });

forum.token = "second-token";
forum.language = "ru";
forum.proxy = "http://127.0.0.1:8080";
forum.baseUrl = "https://api.zelenka.guru";

forum.proxy = undefined; // back to a direct connection
```

The underlying transport is available as `forum.http` if you need it.

## Working with responses

Every method resolves with the standard `Response` object, including for 4xx and 5xx statuses. Nothing is unwrapped or reshaped, so you stay in control.

```typescript
const response = await forum.Users_Get({ userId: 2410024 });

if (!response.ok) {
  const problem = await response.json();
  console.error(response.status, problem);
} else {
  const { user } = await response.json();
  console.log(user.username, user.user_id);
}
```

If you prefer typed payloads, declare them at the call site:

```typescript
interface UserPayload {
  user: { user_id: number; username: string; user_message_count: number };
}

const { user } = (await (await forum.Users_Get({ userId: 2410024 })).json()) as UserPayload;
```

Rate limit headers are available as usual:

```typescript
const remaining = response.headers.get("X-Ratelimit-Remaining");
```

## Error handling

HTTP statuses are never converted into exceptions. Only transport failures throw, and each has its own class.

```typescript
import {
  LolzteamError,
  LolzteamAbortError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "lolzteam-api-ts";

try {
  await forum.Threads_List({ forumId: 876 });
} catch (error) {
  if (error instanceof LolzteamTimeoutError) {
    console.error(`Timed out after ${error.timeoutMs}ms`);
  } else if (error instanceof LolzteamAbortError) {
    console.error("Cancelled by the caller");
  } else if (error instanceof LolzteamNetworkError) {
    console.error("Network failure", error.cause);
  } else if (error instanceof LolzteamError) {
    console.error("Configuration problem", error.message);
  } else {
    throw error;
  }
}
```

`LolzteamError` is the base class, so a single `instanceof LolzteamError` catches all of them.

## Retries and rate limiting

The transport retries automatically on `429`, `500`, `502`, `503` and `504`.

- If the response carries a `Retry-After` header, in seconds or as an HTTP date, that value is used.
- Otherwise the delay grows exponentially with jitter, starting at 500 ms and capped at 30 seconds.
- After `maxRetries` attempts the last response is returned as is, so you can inspect the status yourself.

Separately, `delayMs` enforces a minimum gap between consecutive requests from the same client instance. The default of 500 ms keeps you comfortably inside the published limits. Requests issued concurrently are queued rather than fired at once.

```typescript
// Aggressive, for endpoints you know are cheap.
const fast = new Forum({ token, delayMs: 100 });

// Conservative, for endpoints documented as heavily limited.
const slow = new Market({ token, delayMs: 3000, maxRetries: 8 });
```

## Timeouts and cancellation

```typescript
// Per client.
const forum = new Forum({ token, timeoutMs: 10_000 });

// Per request, through the raw helper.
const controller = new AbortController();
setTimeout(() => controller.abort(), 2000);

await forum.request("GET", "/threads", {
  params: { forum_id: 876 },
  signal: controller.signal,
  timeoutMs: 5000,
});
```

Generated methods take a single `params` object. When you need a per request signal or timeout, use `request()` as shown above.

## File uploads

Endpoints declared as `multipart/form-data` accept binary values directly. A `Blob`, an `ArrayBuffer`, a typed array or a string all work.

```typescript
import { readFile } from "node:fs/promises";

const avatar = await readFile("./avatar.png");

await forum.Users_Avatar_Upload({
  userId: 2410024,
  avatar: new Blob([avatar], { type: "image/png" }),
  crop: 256,
});
```

In the browser you can pass a `File` straight from an `<input type="file">` element.

## Proxies

The global `fetch` does not accept a proxy option, so proxy support goes through an undici dispatcher.

```bash
npm install undici
```

```typescript
const forum = new Forum({
  token,
  proxy: "http://username:password@127.0.0.1:8080",
});
```

SOCKS proxies are not supported by the undici `ProxyAgent`. Supply your own dispatcher instead:

```typescript
import { socksDispatcher } from "fetch-socks";

const forum = new Forum({
  token,
  dispatcher: socksDispatcher({ type: 5, host: "127.0.0.1", port: 1080 }),
});
```

Any custom transport works too:

```typescript
const forum = new Forum({
  token,
  fetch: (url, init) => myInstrumentedFetch(url, init),
});
```

## Raw requests

Use `request()` when an endpoint is missing from the bundled documents, or when you want to control the wire format yourself. Parameter names are passed through untouched.

```typescript
const response = await forum.request("GET", "/users/me");

await forum.request("POST", "/posts", {
  json: { thread_id: 123456, post_body: "Raw body" },
});

await market.request("GET", "/steam", {
  params: { pmin: 100, "origin[]": ["brute", "stealer"] },
});
```

`RequestOptions` accepts `params`, `json`, `data` (urlencoded), `form` (multipart), `headers`, `signal` and `timeoutMs`.

## Browser usage

The package works in the browser without a polyfill. Bear in mind that the LOLZTEAM APIs do not send permissive CORS headers, so browser calls usually need a proxy of your own, and putting a token in client side code exposes it.

```html
<script type="module">
  import { Market } from "https://esm.sh/lolzteam-api-ts";

  const market = new Market({ token: "YOUR_TOKEN", baseUrl: "/api/market-proxy" });
  const response = await market.Profile_Get();
  console.log(await response.json());
</script>
```

## Full API reference

Every generated method, with its route and summary:

- [Forum API reference](docs/api-forum.md), 151 methods
- [Market API reference](docs/api-market.md), 115 methods

Both files are produced by `npm run docs` from the generated sources, so they never drift.

## Regenerating from OpenAPI documents

The bundled documents live in `codegen/schemas/`. Refresh them and rebuild the clients whenever the API changes.

```bash
curl -fsSL "https://raw.githubusercontent.com/AS7RIDENIED/LOLZTEAM/main/Official%20Documentation/forum.json" -o codegen/schemas/forum.json
```

```bash
curl -fsSL "https://raw.githubusercontent.com/AS7RIDENIED/LOLZTEAM/main/Official%20Documentation/market.json" -o codegen/schemas/market.json
```

```bash
npm run codegen && npm run docs
```

To run the generator directly:

```bash
npx ts-node codegen/generate.ts --schema codegen/schemas/forum.json --output src/forum/_generated.ts --class ForumAPI
```

The generator handles path, query and body parameters, `$ref` resolution, `oneOf` and `anyOf` request bodies, enum literal unions, binary uploads, and the `explode` flag that decides between repeated keys and comma joined values. `tests/codegen.test.ts` fails if the checked-in output no longer matches the generator, so drift is caught in CI.

## Development

```bash
npm install
```

```bash
npm run verify
```

`verify` runs the linter, the type checker, the test suite and the full build in that order. Individual steps:

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint over sources, tests, scripts and the generator. |
| `npm run typecheck` | Type check everything without emitting. |
| `npm test` | Jest suite, 99 tests. |
| `npm run test:coverage` | Same with a coverage report. |
| `npm run build` | Clean, then emit CommonJS, ES modules and declarations. |
| `npm run codegen` | Regenerate both API modules. |
| `npm run docs` | Regenerate the method reference. |
| `npm run clean` | Delete `dist/` and `coverage/`. |

## Publishing to npm

The package name is `lolzteam-api-ts`.

### Before the first release

1. Replace the `USERNAME` placeholder in `package.json` with your GitHub account, in `homepage`, `repository.url` and `bugs.url`.
2. Confirm that the name is free by running `npm view lolzteam-api-ts`. A `404` means it is available.
3. Update `LICENSE` with the copyright holder you want to appear.

### Manual publishing

npm requires two-factor authentication for publishing. Enable it first at <https://www.npmjs.com/settings/~/profile>, under Two-Factor Authentication, in the **Authorization and writes** mode. Enrolling an authenticator app as well as a security key is worth the extra minute: only the app gives you a code you can pass on the command line.

```bash
npm login
```

```bash
npm run verify
```

```bash
npm publish --access public --otp=123456
```

Replace the code with the current one from your authenticator app. If you enrolled only a security key there is no code to type, so drop `--otp` and confirm in the browser window npm opens.

`prepublishOnly` runs `npm run verify` for you, so a broken build never reaches the registry. Inspect the exact tarball contents first with:

```bash
npm pack --dry-run
```

### Releasing a new version

```bash
npm version patch
```

`npm version` accepts `patch`, `minor` and `major`, and creates a git tag. Keep `src/version.ts` in step with `package.json`; `tests/package.test.ts` fails if the two drift. Then push and publish:

```bash
git push --follow-tags
```

```bash
npm publish --access public
```

### Automated publishing from GitHub Actions

`.github/workflows/publish.yml` publishes whenever you push a tag shaped like `v1.2.3`. It uses **trusted publishing** over OIDC, so no npm token is stored in the repository.

Long lived granular access tokens with the 2FA bypass option are being retired: they lose sensitive account operations in early August 2026 and lose direct publishing around January 2027. Trusted publishing is the replacement.

Trusted publishing can only be configured on a package that already exists, so the very first version has to go out manually as described above. After that:

1. Open `https://www.npmjs.com/package/lolzteam-api-ts/access`.
2. Under **Trusted Publisher**, choose **GitHub Actions**.
3. Fill in the fields:
   - **Organization or user**: your GitHub account
   - **Repository**: `lolzteam-api-ts`
   - **Workflow filename**: `publish.yml`, the filename only, not a path
   - **Environment name**: leave empty unless you add one to the workflow
4. Under **Allowed actions**, select `npm publish`.
5. Tag and push:

```bash
git tag v1.0.0 && git push origin v1.0.0
```

The workflow lints, type checks and tests on Node 18, 20 and 22, then builds and publishes with provenance attached.

Requirements the workflow already satisfies, listed here because they are easy to break:

- `permissions: id-token: write` on the publish job, which mints the OIDC token.
- npm 11.5.1 or newer and Node 22.14.0 or newer. Node 22 still ships npm 10, so the workflow upgrades npm before publishing.
- No `registry-url` on `actions/setup-node`. It would write an `.npmrc` with an empty auth token, which conflicts with OIDC.
- `repository.url` in `package.json` matching the GitHub repository exactly.

### Publishing under a scope

If the unscoped name is taken, switch to a scoped name:

```bash
npm pkg set name=@your-scope/lolzteam-api-ts
```

Scoped packages are private by default, which is why `--access public` is passed on every publish command above.

## Project structure

```
lolzteam-api-ts/
├── .github/workflows/
│   ├── ci.yml                  Lint, type check, test and build on every push
│   └── publish.yml             Publish to npm on a version tag
├── codegen/
│   ├── generate.ts             OpenAPI to TypeScript generator
│   └── schemas/
│       ├── forum.json          Official Forum OpenAPI document
│       └── market.json         Official Market OpenAPI document
├── docs/
│   ├── api-forum.md            Generated Forum method reference
│   └── api-market.md           Generated Market method reference
├── scripts/
│   ├── api-reference.mjs       Builds the files in docs/
│   ├── clean.mjs               Removes build output
│   └── postbuild.mjs           Finalizes and verifies the dual package build
├── src/
│   ├── core/
│   │   ├── base.ts             BaseClient: settings, raw requests, name mapping
│   │   ├── client.ts           HTTP transport: retries, throttling, timeouts
│   │   ├── errors.ts           Error hierarchy
│   │   └── index.ts            Core exports
│   ├── forum/
│   │   ├── _generated.ts       151 generated Forum methods
│   │   └── index.ts            Forum client
│   ├── market/
│   │   ├── _generated.ts       115 generated Market methods
│   │   └── index.ts            Market client
│   ├── index.ts                Package entry point
│   └── version.ts              Version constant
├── tests/
│   ├── client.test.ts          Transport behaviour
│   ├── codegen.test.ts         Generator output and freshness
│   ├── forum.test.ts           Forum client and wire mapping
│   ├── helpers.ts              Shared fetch interception helpers
│   ├── market.test.ts          Market client and wire mapping
│   └── package.test.ts         Packaging and public surface invariants
├── .editorconfig
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md                   This file
├── README.ru.md                Russian translation
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json               Editor and type checking configuration
├── tsconfig.build.json         Shared build settings
├── tsconfig.cjs.json           CommonJS output
├── tsconfig.esm.json           ES module output
└── tsconfig.types.json         Declaration output
```

## License

MIT. See [LICENSE](LICENSE).

This project is not affiliated with, endorsed by, or sponsored by LOLZTEAM. Use it in accordance with the platform rules and the applicable terms of service.
