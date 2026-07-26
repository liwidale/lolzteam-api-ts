/**
 * src/core/base.ts
 * ----------------
 * Shared base class for every API surface.
 *
 * The generated classes (`ForumAPI`, `MarketAPI`) extend `BaseClient`, and the
 * public `Forum` / `Market` classes extend those. That single inheritance chain
 * means generated methods are real prototype methods: they show up in `.d.ts`
 * output, they are tree-shakeable and there is no runtime method copying.
 */

import { LolzteamClient } from "./client.js";
import type { ClientOptions, FetchLike, QueryParams, RequestOptions } from "./client.js";

/**
 * Mapping from a TypeScript parameter name to the wire name expected by the
 * API.
 *
 * A plain string is the wire name. The tuple form marks an array parameter
 * declared with `explode: false` in the OpenAPI document, which must be sent as
 * a single comma separated value instead of repeated keys.
 */
export type WireMapping = Record<string, string | readonly [string, "csv"]>;

export interface BaseClientOptions {
  /** Bearer token used for the `Authorization` header. */
  token: string;
  /** Response language, `ru` or `en`. Defaults to `en`. */
  language?: string;
  /** Override the default API base URL. */
  baseUrl?: string;
  /**
   * HTTP or HTTPS proxy URL, for example `http://user:pass@host:8080`.
   *
   * Node.js only, and it requires the optional `undici` package. For SOCKS
   * proxies supply your own `dispatcher` or `fetch`.
   */
  proxy?: string;
  /** Pre-built undici dispatcher. Takes precedence over `proxy`. */
  dispatcher?: unknown;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeoutMs?: number;
  /** Minimum delay between two consecutive requests, in milliseconds. */
  delayMs?: number;
  /** Number of attempts for retryable statuses. Defaults to 5. */
  maxRetries?: number;
  /** HTTP statuses that trigger a retry. Defaults to 429, 500, 502, 503, 504. */
  retryStatuses?: readonly number[];
  /** Value of the `User-Agent` header. Ignored by browsers. */
  userAgent?: string;
  /** Custom `fetch` implementation. */
  fetch?: FetchLike;
  /** Set to false to silence retry warnings. Defaults to true. */
  warnOnRetry?: boolean;
}

export class BaseClient {
  /** Underlying HTTP transport. */
  protected readonly _http: LolzteamClient;

  constructor(baseUrl: string, options: BaseClientOptions) {
    const clientOptions: ClientOptions = {
      baseUrl: options.baseUrl ?? baseUrl,
      token: options.token,
      language: options.language ?? "en",
    };
    if (options.proxy !== undefined) clientOptions.proxy = options.proxy;
    if (options.dispatcher !== undefined) clientOptions.dispatcher = options.dispatcher;
    if (options.timeoutMs !== undefined) clientOptions.timeoutMs = options.timeoutMs;
    if (options.delayMs !== undefined) clientOptions.delayMs = options.delayMs;
    if (options.maxRetries !== undefined) clientOptions.maxRetries = options.maxRetries;
    if (options.retryStatuses !== undefined) clientOptions.retryStatuses = options.retryStatuses;
    if (options.userAgent !== undefined) clientOptions.userAgent = options.userAgent;
    if (options.fetch !== undefined) clientOptions.fetch = options.fetch;
    if (options.warnOnRetry !== undefined) clientOptions.warnOnRetry = options.warnOnRetry;

    this._http = new LolzteamClient(clientOptions);
  }

  // -- Settings -------------------------------------------------------------

  /** The transport instance, exposed for advanced use. */
  get http(): LolzteamClient {
    return this._http;
  }

  /** Bearer token. Changing it affects every subsequent request. */
  get token(): string {
    return this._http.token;
  }
  set token(value: string) {
    this._http.token = value;
  }

  /** Response language, `ru` or `en`. */
  get language(): string {
    return this._http.language;
  }
  set language(value: string) {
    this._http.language = value;
  }

  /** Proxy URL, or `undefined` to send requests directly. */
  get proxy(): string | undefined {
    return this._http.proxy;
  }
  set proxy(value: string | undefined) {
    this._http.proxy = value;
  }

  /** API base URL. */
  get baseUrl(): string {
    return this._http.baseUrl;
  }
  set baseUrl(value: string) {
    this._http.baseUrl = value;
  }

  // -- Raw access -----------------------------------------------------------

  /**
   * Send a request to an arbitrary endpoint.
   *
   * Useful for endpoints that are missing from the bundled OpenAPI documents.
   *
   * @example
   * ```typescript
   * const response = await client.request("GET", "/users/me");
   * const data = await response.json();
   * ```
   */
  request(method: string, path: string, options?: RequestOptions): Promise<Response> {
    return this._http.request(method, path, options);
  }

  // -- Helpers used by generated code ---------------------------------------

  /** @internal */
  protected _request(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this._http.request(method, path, options);
  }

  /**
   * Encode a value for use inside a URL path segment.
   * @internal
   */
  protected _seg(value: unknown): string {
    return encodeURIComponent(String(value));
  }

  /**
   * Translate camelCase TypeScript parameters back into the snake_case (and
   * bracketed) names the LOLZTEAM APIs expect on the wire.
   *
   * Keys whose value is `undefined` are dropped so that optional parameters
   * never reach the server.
   *
   * @internal
   */
  protected _pick(source: Record<string, unknown>, mapping: WireMapping): QueryParams {
    const result: QueryParams = {};
    for (const key of Object.keys(mapping)) {
      const value = source[key];
      if (value === undefined) continue;
      const spec = mapping[key] as string | readonly [string, "csv"];
      if (typeof spec === "string") {
        result[spec] = value;
      } else {
        result[spec[0]] = Array.isArray(value) ? value.join(",") : value;
      }
    }
    return result;
  }
}
