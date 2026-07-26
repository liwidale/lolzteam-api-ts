/**
 * src/core/client.ts
 * ------------------
 * Universal HTTP transport layer.
 *
 * Runs unchanged on Node.js 18+ (global `fetch` from undici), Deno, Bun,
 * Cloudflare Workers and every modern browser. The package has no runtime
 * dependencies: if `globalThis.fetch` is missing you can inject your own
 * implementation through the `fetch` option.
 */

import {
  LolzteamAbortError,
  LolzteamError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "./errors.js";
import { VERSION } from "../version.js";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Minimal structural type of the `fetch` function used by the client. */
export type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

/** Values accepted for a binary multipart field (file uploads). */
export type BinaryInput = Blob | ArrayBuffer | ArrayBufferView | string;

/** A single query string value. */
export type QueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | ReadonlyArray<string | number | boolean | Date>;

/** Query string bag. Arrays are expanded into repeated keys. */
export type QueryParams = Record<string, unknown>;

export interface ClientOptions {
  /** API base URL, for example `https://prod-api.lolz.live`. */
  baseUrl: string;
  /** Bearer token used for the `Authorization` header. */
  token: string;
  /** Response language, `ru` or `en`. Defaults to `en`. */
  language?: string;
  /**
   * HTTP or HTTPS proxy URL, for example `http://user:pass@host:8080`.
   *
   * Node.js only, and it requires the optional `undici` package to be
   * installed. For SOCKS proxies supply your own `dispatcher` or `fetch`.
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

export interface RequestOptions {
  /** Query string parameters. */
  params?: QueryParams;
  /** JSON request body. Sets `Content-Type: application/json`. */
  json?: unknown;
  /** Form body. Sets `Content-Type: application/x-www-form-urlencoded`. */
  data?: Record<string, unknown>;
  /** Multipart body. Sets `Content-Type: multipart/form-data`. */
  form?: Record<string, unknown>;
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>;
  /** Abort signal supplied by the caller. */
  signal?: AbortSignal;
  /** Per-request timeout override, in milliseconds. */
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Test seam
// ---------------------------------------------------------------------------

let overrideFetch: FetchLike | undefined;

/**
 * Replace the `fetch` implementation used by every client instance.
 * Intended for tests only.
 */
export function _setFetch(fn: FetchLike): void {
  overrideFetch = fn;
}

/** Undo a previous {@link _setFetch} call. */
export function _resetFetch(): void {
  overrideFetch = undefined;
}

function resolveFetch(custom: FetchLike | undefined): FetchLike {
  if (overrideFetch) return overrideFetch;
  if (custom) return custom;
  const globalFetch = (globalThis as { fetch?: FetchLike }).fetch;
  if (typeof globalFetch === "function") {
    return (input, init) => globalFetch.call(globalThis, input, init);
  }
  throw new LolzteamError(
    "Global fetch() is not available in this runtime. " +
      "Use Node.js 18 or newer, or pass a custom implementation via the `fetch` client option."
  );
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_RETRY_STATUSES: readonly number[] = [429, 500, 502, 503, 504];
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_TIMEOUT_MS = 30_000;
const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 30_000;

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoff(attempt: number): number {
  const ceiling = Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt), MAX_BACKOFF_MS);
  return Math.round(ceiling / 2 + Math.random() * (ceiling / 2));
}

function scalarToString(value: string | number | boolean | Date): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function appendQuery(search: URLSearchParams, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    for (const item of value) appendQuery(search, key, item);
    return;
  }
  search.append(key, scalarToString(value as string | number | boolean | Date));
}

function buildUrl(baseUrl: string, path: string, params?: QueryParams): string {
  const absolute = /^https?:\/\//i.test(path);
  const url = new URL(absolute ? path : baseUrl.replace(/\/+$/, "") + ensureLeadingSlash(path));
  if (params) {
    for (const key of Object.keys(params)) {
      appendQuery(url.searchParams, key, params[key]);
    }
  }
  return url.toString();
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrlEncodedBody(data: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const key of Object.keys(data)) {
    appendQuery(search, key, data[key]);
  }
  return search.toString();
}

function buildMultipartBody(form: Record<string, unknown>): FormData {
  if (typeof FormData !== "function") {
    throw new LolzteamError(
      "FormData is not available in this runtime, so multipart uploads are unsupported."
    );
  }
  const body = new FormData();
  for (const key of Object.keys(form)) {
    appendMultipart(body, key, form[key]);
  }
  return body;
}

function appendMultipart(body: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    for (const item of value) appendMultipart(body, key, item);
    return;
  }
  if (typeof Blob === "function" && value instanceof Blob) {
    body.append(key, value);
    return;
  }
  if (value instanceof ArrayBuffer) {
    body.append(key, new Blob([value]));
    return;
  }
  if (ArrayBuffer.isView(value)) {
    const view = value as ArrayBufferView;
    const copy = new Uint8Array(view.byteLength);
    copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
    body.append(key, new Blob([copy]));
    return;
  }
  body.append(key, scalarToString(value as string | number | boolean | Date));
}

async function createDispatcher(proxy: string): Promise<unknown> {
  if (/^socks/i.test(proxy)) {
    warn(
      "SOCKS proxies are not supported by the global fetch(). " +
        "Pass a custom `dispatcher` or a custom `fetch` implementation instead."
    );
    return undefined;
  }
  try {
    // The cast keeps TypeScript from resolving an optional peer dependency.
    const undici = (await import("undici" as string)) as {
      ProxyAgent: new (uri: string) => unknown;
    };
    return new undici.ProxyAgent(proxy);
  } catch {
    warn("HTTP proxy support requires the optional `undici` package. Install it with: npm install undici");
    return undefined;
  }
}

function warn(message: string): void {
  console.warn(`[lolzteam-api-ts] ${message}`);
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { name?: unknown }).name === "AbortError"
  );
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/** Low level HTTP client. Most users should use `Forum` or `Market` instead. */
export class LolzteamClient {
  private _baseUrl: string;
  private _token: string;
  private _language: string;
  private _proxy: string | undefined;
  private _dispatcher: unknown;
  private _dispatcherPromise: Promise<unknown> | undefined;
  private readonly _timeoutMs: number;
  private readonly _delayMs: number;
  private readonly _maxRetries: number;
  private readonly _retryStatuses: ReadonlySet<number>;
  private readonly _userAgent: string;
  private readonly _fetch: FetchLike | undefined;
  private readonly _warnOnRetry: boolean;
  private _queue: Promise<void> = Promise.resolve();
  private _lastRequestAt = 0;

  constructor(options: ClientOptions) {
    if (!options.baseUrl) {
      throw new LolzteamError("`baseUrl` is required.");
    }
    this._baseUrl = options.baseUrl.replace(/\/+$/, "");
    this._token = options.token ?? "";
    this._language = options.language ?? "en";
    this._timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this._delayMs = options.delayMs ?? 0;
    this._maxRetries = Math.max(1, options.maxRetries ?? DEFAULT_MAX_RETRIES);
    this._retryStatuses = new Set(options.retryStatuses ?? DEFAULT_RETRY_STATUSES);
    this._userAgent = options.userAgent ?? `lolzteam-api-ts/${VERSION}`;
    this._fetch = options.fetch;
    this._warnOnRetry = options.warnOnRetry ?? true;
    this._dispatcher = options.dispatcher;
    this._proxy = options.proxy;
    if (options.proxy && options.dispatcher === undefined) {
      this._dispatcherPromise = createDispatcher(options.proxy);
    }
  }

  // -- Settings -------------------------------------------------------------

  get baseUrl(): string {
    return this._baseUrl;
  }
  set baseUrl(value: string) {
    this._baseUrl = value.replace(/\/+$/, "");
  }

  get token(): string {
    return this._token;
  }
  set token(value: string) {
    this._token = value;
  }

  get language(): string {
    return this._language;
  }
  set language(value: string) {
    this._language = value;
  }

  get proxy(): string | undefined {
    return this._proxy;
  }
  set proxy(value: string | undefined) {
    this._proxy = value;
    this._dispatcher = undefined;
    this._dispatcherPromise = value ? createDispatcher(value) : undefined;
  }

  // -- Core request ---------------------------------------------------------

  /**
   * Perform a single API request.
   *
   * Resolves with the raw `Response`, including for 4xx and 5xx statuses.
   * Throws only on transport failures, timeouts and aborts.
   */
  async request(method: string, path: string, options: RequestOptions = {}): Promise<Response> {
    const verb = method.toUpperCase();
    const url = buildUrl(this._baseUrl, path, options.params);
    const timeoutMs = options.timeoutMs ?? this._timeoutMs;
    const doFetch = resolveFetch(this._fetch);
    const dispatcher = await this._resolveDispatcher();

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Accept-Language": this._language,
      "User-Agent": this._userAgent,
    };
    if (this._token) {
      headers.Authorization = `Bearer ${this._token}`;
    }

    let body: BodyInit | undefined;
    if (options.json !== undefined) {
      body = JSON.stringify(options.json);
      headers["Content-Type"] = "application/json";
    } else if (options.data !== undefined) {
      body = buildUrlEncodedBody(options.data);
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (options.form !== undefined) {
      // Content-Type is set by fetch so that the multipart boundary matches.
      body = buildMultipartBody(options.form);
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    let response: Response | undefined;

    for (let attempt = 0; attempt < this._maxRetries; attempt++) {
      await this._throttle();

      response = await this._send(doFetch, verb, url, {
        headers,
        body,
        dispatcher,
        signal: options.signal,
        timeoutMs,
      });

      if (!this._retryStatuses.has(response.status) || attempt === this._maxRetries - 1) {
        return response;
      }

      const wait = this._retryDelay(response, attempt);
      if (this._warnOnRetry) {
        warn(
          `${verb} ${url} returned ${response.status}, retrying in ${wait}ms ` +
            `(attempt ${attempt + 1} of ${this._maxRetries})`
        );
      }
      await sleep(wait);
    }

    /* istanbul ignore next: the loop always returns or throws */
    return response as Response;
  }

  // -- Internals ------------------------------------------------------------

  private async _send(
    doFetch: FetchLike,
    method: string,
    url: string,
    init: {
      headers: Record<string, string>;
      body: BodyInit | undefined;
      dispatcher: unknown;
      signal: AbortSignal | undefined;
      timeoutMs: number;
    }
  ): Promise<Response> {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, init.timeoutMs);

    const detach = init.signal ? forward(init.signal, controller) : undefined;

    try {
      const requestInit: RequestInit & { dispatcher?: unknown } = {
        method,
        headers: { ...init.headers },
        signal: controller.signal,
      };
      if (init.body !== undefined) {
        requestInit.body = init.body;
      }
      if (init.dispatcher !== undefined) {
        requestInit.dispatcher = init.dispatcher;
      }
      return await doFetch(url, requestInit);
    } catch (error) {
      if (timedOut) throw new LolzteamTimeoutError(method, url, init.timeoutMs);
      if (init.signal?.aborted || isAbortError(error)) {
        throw new LolzteamAbortError(method, url);
      }
      throw new LolzteamNetworkError(method, url, error);
    } finally {
      clearTimeout(timer);
      detach?.();
    }
  }

  private _retryDelay(response: Response, attempt: number): number {
    const header = response.headers.get("Retry-After");
    if (header) {
      const seconds = Number.parseFloat(header);
      if (Number.isFinite(seconds) && seconds >= 0) {
        return Math.min(Math.round(seconds * 1000), MAX_BACKOFF_MS);
      }
      const date = Date.parse(header);
      if (Number.isFinite(date)) {
        return Math.min(Math.max(date - Date.now(), 0), MAX_BACKOFF_MS);
      }
    }
    return backoff(attempt);
  }

  /**
   * Serialize the wait so that concurrent callers do not all observe the same
   * `_lastRequestAt` value and fire at once.
   */
  private _throttle(): Promise<void> {
    if (this._delayMs <= 0) return Promise.resolve();
    const next = this._queue.then(async () => {
      const elapsed = Date.now() - this._lastRequestAt;
      if (elapsed < this._delayMs) {
        await sleep(this._delayMs - elapsed);
      }
      this._lastRequestAt = Date.now();
    });
    this._queue = next.catch(() => undefined);
    return next;
  }

  private async _resolveDispatcher(): Promise<unknown> {
    if (this._dispatcher !== undefined) return this._dispatcher;
    if (!this._dispatcherPromise) return undefined;
    this._dispatcher = await this._dispatcherPromise;
    this._dispatcherPromise = undefined;
    return this._dispatcher;
  }
}

function forward(source: AbortSignal, target: AbortController): () => void {
  if (source.aborted) {
    target.abort();
    return () => undefined;
  }
  const onAbort = (): void => target.abort();
  source.addEventListener("abort", onAbort);
  return () => source.removeEventListener("abort", onAbort);
}
