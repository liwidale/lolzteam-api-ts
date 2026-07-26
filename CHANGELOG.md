# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0]

First release under the name `lolzteam-api-ts`.

### Added

- `Forum` client with 151 methods generated from the official Forum OpenAPI 3.1 document.
- `Market` client with 115 methods generated from the official Market OpenAPI 3.1 document.
- Automatic translation between camelCase TypeScript parameters and the snake_case, bracketed and comma joined names the APIs expect.
- Literal union types for every enum in the documents, including enums reached through `$ref`.
- Per parameter documentation comments, with enum value meanings and default values.
- `multipart/form-data` support with `Blob`, `ArrayBuffer`, typed array and string values.
- Error hierarchy: `LolzteamError`, `LolzteamTimeoutError`, `LolzteamAbortError` and `LolzteamNetworkError`.
- Configurable retries with `Retry-After` support and exponential backoff with jitter.
- Request throttling that queues concurrent calls instead of firing them at once.
- Per client and per request timeouts, plus cancellation through `AbortSignal`.
- Proxy support through an undici dispatcher, with a `dispatcher` and a `fetch` escape hatch.
- Base URL mirrors exported as `FORUM_MIRRORS` and `MARKET_MIRRORS`.
- Generated method reference in `docs/api-forum.md` and `docs/api-market.md`.
- Continuous integration workflow covering lint, type check, tests and build on Node 18, 20 and 22.

### Changed

- Package renamed from `lolzteam` to `lolzteam-api-ts`.
- `Forum` and `Market` are now plain classes that extend the generated API classes. The previous runtime method copying and the `ForumBase & ForumAPI` intersection type are gone, so declarations and `instanceof` behave normally.
- The ES module build now carries file extensions on every relative import and a `dist/esm/package.json` marker, so Node can actually load it.
- The `exports` map lists `types` before the runtime conditions.
- Default Market host changed to `https://prod-api.lzt.market`, the primary server in the official document.

### Removed

- The `cross-fetch` runtime dependency. The package now has none and relies on the global `fetch`.
- `src/core/mixin.ts` and the `ApiMixin` class, replaced by `BaseClient`.

### Fixed

- Query and body parameters were sent with camelCase names instead of the names the APIs expect, which made effectively every generated method fail silently. They are now translated back before the request is sent.
- Path parameters leaked into the query string and the request body.
- Operations that declare both query parameters and a request body sent the same object as both.
- `oneOf` request bodies, such as the OAuth token endpoint, produced a method with no parameters at all.
- Multipart endpoints sent a JSON body.
- Array query parameters were serialized as a single comma joined value regardless of the `explode` flag in the document.
- The proxy agent was built asynchronously without being awaited, so early requests bypassed the proxy.
- `agent` was passed to the global `fetch`, which ignores it. An undici `dispatcher` is used instead.
