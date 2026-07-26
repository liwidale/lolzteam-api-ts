/**
 * src/market/index.ts
 * -------------------
 * High level client for the LOLZTEAM Market API.
 */

import type { BaseClientOptions } from "../core/base.js";
import { MarketAPI } from "./_generated.js";

/** Default Market API base URL. */
export const MARKET_BASE_URL = "https://prod-api.lzt.market";

/**
 * Alternative Market API base URLs.
 *
 * Pass one of these as `baseUrl` if the default host is unreachable.
 */
export const MARKET_MIRRORS = [
  "https://prod-api.lzt.market",
  "https://api.lzt.market",
] as const;

/** Options accepted by the {@link Market} constructor. */
export type MarketOptions = BaseClientOptions;

/** Default minimum delay between two Market requests, in milliseconds. */
const DEFAULT_DELAY_MS = 500;

type Params<Method extends keyof MarketAPI> = MarketAPI[Method] extends (
  params: infer P
) => unknown
  ? P
  : never;

/**
 * Client for the LOLZTEAM Market API.
 *
 * Every operation from the official OpenAPI document is available as a method
 * on this class, plus a handful of shorthands and a raw {@link Market.request}
 * escape hatch.
 *
 * @example
 * ```typescript
 * import { Market } from "lolzteam-api-ts";
 *
 * const market = new Market({ token: process.env.LOLZ_TOKEN! });
 * const response = await market.Managing_Get({ itemId: 12345678 });
 * const { item } = await response.json();
 * ```
 */
export class Market extends MarketAPI {
  constructor(options: MarketOptions) {
    super(MARKET_BASE_URL, { ...options, delayMs: options.delayMs ?? DEFAULT_DELAY_MS });
  }

  // -- Shorthands -----------------------------------------------------------

  /** Fetch the authenticated market profile. Shorthand for `Profile_Get`. */
  me(params: NonNullable<Params<"Profile_Get">> = {}): Promise<Response> {
    return this.Profile_Get(params);
  }

  /** Fetch a single item. Shorthand for `Managing_Get`. */
  getItem(params: NonNullable<Params<"Managing_Get">>): Promise<Response> {
    return this.Managing_Get(params);
  }

  /** Fetch the payments history. Shorthand for `Payments_History`. */
  getPayments(params: NonNullable<Params<"Payments_History">> = {}): Promise<Response> {
    return this.Payments_History(params);
  }

  /** Transfer money to another user. Shorthand for `Payments_Transfer`. */
  transfer(params: NonNullable<Params<"Payments_Transfer">>): Promise<Response> {
    return this.Payments_Transfer(params);
  }
}

export { MarketAPI };
