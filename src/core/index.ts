/**
 * src/core/index.ts
 * -----------------
 * Public surface of the transport layer.
 */

export { LolzteamClient, _setFetch, _resetFetch } from "./client.js";
export type {
  BinaryInput,
  ClientOptions,
  FetchLike,
  QueryParams,
  QueryValue,
  RequestOptions,
} from "./client.js";

export { BaseClient } from "./base.js";
export type { BaseClientOptions, WireMapping } from "./base.js";

export {
  LolzteamAbortError,
  LolzteamError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "./errors.js";
