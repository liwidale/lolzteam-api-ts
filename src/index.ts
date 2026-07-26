/**
 * lolzteam-api-ts
 * ---------------
 * TypeScript and JavaScript SDK for the LOLZTEAM Forum and Market APIs.
 *
 * Runs unchanged on Node.js 18+, Deno, Bun, Cloudflare Workers and modern
 * browsers. No runtime dependencies.
 *
 * @example
 * ```typescript
 * import { Forum, Market } from "lolzteam-api-ts";
 *
 * const forum = new Forum({ token: process.env.LOLZ_TOKEN! });
 * const market = new Market({ token: process.env.LOLZ_TOKEN! });
 *
 * const profile = await (await forum.me()).json();
 * const item = await (await market.getItem({ itemId: 12345678 })).json();
 * ```
 *
 * @packageDocumentation
 */

export { Forum, ForumAPI, FORUM_BASE_URL, FORUM_MIRRORS } from "./forum/index.js";
export type { ForumOptions } from "./forum/index.js";

export { Market, MarketAPI, MARKET_BASE_URL, MARKET_MIRRORS } from "./market/index.js";
export type { MarketOptions } from "./market/index.js";

export { BaseClient, LolzteamClient, _setFetch, _resetFetch } from "./core/index.js";
export type {
  BaseClientOptions,
  BinaryInput,
  ClientOptions,
  FetchLike,
  QueryParams,
  QueryValue,
  RequestOptions,
  WireMapping,
} from "./core/index.js";

export {
  LolzteamAbortError,
  LolzteamError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "./core/index.js";

export { VERSION } from "./version.js";
