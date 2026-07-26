/**
 * tests/helpers.ts
 * ----------------
 * Shared fetch interception utilities.
 */

import { _resetFetch, _setFetch } from "../src/core/client.js";

export interface CapturedRequest {
  url: string;
  method: string;
  /** Header names are lowercased so lookups are case insensitive. */
  headers: Record<string, string>;
  body: BodyInit | undefined;
}

export interface FetchRecorder {
  /** Every request the client attempted, in order. */
  readonly calls: CapturedRequest[];
  /** The most recent request. Throws when nothing was captured. */
  last(): CapturedRequest;
  /** Query string of the most recent request, already parsed. */
  lastQuery(): URLSearchParams;
  /** JSON body of the most recent request. */
  lastJson<T = Record<string, unknown>>(): T;
}

type Responder = (request: CapturedRequest, index: number) => Response | Promise<Response>;

/** Build a JSON response. */
export function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/**
 * Install a fake `fetch` for the duration of the current test.
 *
 * @param responder Either a fixed response or a function producing one.
 */
export function recordFetch(responder: Responder | Response = jsonResponse({ ok: true })): FetchRecorder {
  const calls: CapturedRequest[] = [];

  _setFetch(async (input, init) => {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries((init.headers ?? {}) as Record<string, string>)) {
      headers[key.toLowerCase()] = value;
    }
    const captured: CapturedRequest = {
      url: input,
      method: init.method ?? "GET",
      headers,
      body: init.body ?? undefined,
    };
    calls.push(captured);
    if (typeof responder === "function") {
      return responder(captured, calls.length - 1);
    }
    return responder.clone();
  });

  return {
    calls,
    last(): CapturedRequest {
      const call = calls[calls.length - 1];
      if (!call) throw new Error("No request was captured.");
      return call;
    },
    lastQuery(): URLSearchParams {
      return new URL(this.last().url).searchParams;
    },
    lastJson<T = Record<string, unknown>>(): T {
      const body = this.last().body;
      if (typeof body !== "string") throw new Error("The last request had no string body.");
      return JSON.parse(body) as T;
    },
  };
}

/**
 * Install a `fetch` that never settles until its signal aborts.
 *
 * Used to exercise the timeout and abort paths.
 */
export function installHangingFetch(): void {
  _setFetch(
    (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        const fail = (): void => {
          const error = new Error("The operation was aborted.");
          error.name = "AbortError";
          reject(error);
        };
        if (init.signal?.aborted) {
          fail();
          return;
        }
        init.signal?.addEventListener("abort", fail);
      })
  );
}

/** Remove the fake `fetch`. */
export function restoreFetch(): void {
  _resetFetch();
}
