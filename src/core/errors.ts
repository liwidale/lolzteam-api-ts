/**
 * src/core/errors.ts
 * ------------------
 * Error types raised by the transport layer.
 *
 * Note: HTTP responses are never turned into errors. Every request method
 * resolves with the raw `Response` object so that callers stay in control of
 * status handling. Only transport-level failures throw.
 */

/** Base class for every error thrown by this package. */
export class LolzteamError extends Error {
  /** Underlying error, when this error wraps another one. */
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "LolzteamError";
    if (cause !== undefined) {
      this.cause = cause;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when a request exceeds the configured timeout. */
export class LolzteamTimeoutError extends LolzteamError {
  /** Timeout that was exceeded, in milliseconds. */
  readonly timeoutMs: number;

  constructor(method: string, url: string, timeoutMs: number) {
    super(`${method} ${url} timed out after ${timeoutMs}ms`);
    this.name = "LolzteamTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

/** Thrown when the request was aborted through a caller supplied signal. */
export class LolzteamAbortError extends LolzteamError {
  constructor(method: string, url: string) {
    super(`${method} ${url} was aborted`);
    this.name = "LolzteamAbortError";
  }
}

/** Thrown when the network layer itself fails (DNS, TLS, connection reset). */
export class LolzteamNetworkError extends LolzteamError {
  constructor(method: string, url: string, cause: unknown) {
    super(`${method} ${url} failed: ${describe(cause)}`, cause);
    this.name = "LolzteamNetworkError";
  }
}

function describe(cause: unknown): string {
  if (cause instanceof Error) return cause.message;
  return String(cause);
}
