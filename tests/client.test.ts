/**
 * tests/client.test.ts
 * --------------------
 * Transport layer behaviour.
 */

import { LolzteamClient } from "../src/core/client.js";
import {
  LolzteamAbortError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "../src/core/errors.js";
import { _setFetch } from "../src/core/client.js";
import { VERSION } from "../src/version.js";
import { installHangingFetch, jsonResponse, recordFetch, restoreFetch } from "./helpers.js";

const BASE = "https://prod-api.lolz.live";
const TOKEN = "test-token";

function client(overrides: Partial<ConstructorParameters<typeof LolzteamClient>[0]> = {}): LolzteamClient {
  return new LolzteamClient({ baseUrl: BASE, token: TOKEN, warnOnRetry: false, ...overrides });
}

afterEach(() => {
  restoreFetch();
});

describe("LolzteamClient headers", () => {
  test("sends the bearer token", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/users/me");
    expect(recorder.last().headers.authorization).toBe(`Bearer ${TOKEN}`);
  });

  test("omits the Authorization header when no token is configured", async () => {
    const recorder = recordFetch();
    await client({ token: "" }).request("GET", "/users/me");
    expect(recorder.last().headers.authorization).toBeUndefined();
  });

  test("sends the configured language", async () => {
    const recorder = recordFetch();
    await client({ language: "ru" }).request("GET", "/users/me");
    expect(recorder.last().headers["accept-language"]).toBe("ru");
  });

  test("defaults the language to en", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/users/me");
    expect(recorder.last().headers["accept-language"]).toBe("en");
  });

  test("sends a versioned user agent", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/users/me");
    expect(recorder.last().headers["user-agent"]).toBe(`lolzteam-api-ts/${VERSION}`);
  });

  test("merges per-request headers over the defaults", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/users/me", { headers: { "X-Trace": "abc" } });
    expect(recorder.last().headers["x-trace"]).toBe("abc");
  });

  test("the token setter affects the next request", async () => {
    const recorder = recordFetch();
    const instance = client();
    instance.token = "rotated";
    await instance.request("GET", "/users/me");
    expect(recorder.last().headers.authorization).toBe("Bearer rotated");
  });

  test("the language setter affects the next request", async () => {
    const recorder = recordFetch();
    const instance = client();
    instance.language = "ru";
    await instance.request("GET", "/users/me");
    expect(recorder.last().headers["accept-language"]).toBe("ru");
  });
});

describe("LolzteamClient URL building", () => {
  test("joins the base URL and the path", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads");
    expect(recorder.last().url).toBe(`${BASE}/threads`);
  });

  test("normalizes a trailing slash on the base URL", async () => {
    const recorder = recordFetch();
    await client({ baseUrl: `${BASE}///` }).request("GET", "/threads");
    expect(recorder.last().url).toBe(`${BASE}/threads`);
  });

  test("accepts a path without a leading slash", async () => {
    const recorder = recordFetch();
    await client().request("GET", "threads");
    expect(recorder.last().url).toBe(`${BASE}/threads`);
  });

  test("accepts an absolute URL and ignores the base URL", async () => {
    const recorder = recordFetch();
    await client().request("GET", "https://example.test/other");
    expect(recorder.last().url).toBe("https://example.test/other");
  });

  test("appends scalar query parameters", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads", { params: { forum_id: 876, limit: 10 } });
    const query = recorder.lastQuery();
    expect(query.get("forum_id")).toBe("876");
    expect(query.get("limit")).toBe("10");
  });

  test("repeats array query parameters", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads", { params: { "prefix_ids[]": [1, 2, 3] } });
    expect(recorder.lastQuery().getAll("prefix_ids[]")).toEqual(["1", "2", "3"]);
  });

  test("drops undefined and null query parameters", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads", {
      params: { a: undefined, b: null, c: 0, d: false, e: "" },
    });
    const query = recorder.lastQuery();
    expect(query.has("a")).toBe(false);
    expect(query.has("b")).toBe(false);
    expect(query.get("c")).toBe("0");
    expect(query.get("d")).toBe("false");
    expect(query.get("e")).toBe("");
  });

  test("serializes Date query parameters as ISO strings", async () => {
    const recorder = recordFetch();
    const date = new Date("2025-01-02T03:04:05.000Z");
    await client().request("GET", "/threads", { params: { since: date } });
    expect(recorder.lastQuery().get("since")).toBe("2025-01-02T03:04:05.000Z");
  });

  test("preserves a query string already present in the path", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads?tab=new", { params: { limit: 5 } });
    const query = recorder.lastQuery();
    expect(query.get("tab")).toBe("new");
    expect(query.get("limit")).toBe("5");
  });
});

describe("LolzteamClient bodies", () => {
  test("sends a JSON body", async () => {
    const recorder = recordFetch();
    await client().request("POST", "/posts", { json: { thread_id: 1, post_body: "Hello" } });
    expect(recorder.last().headers["content-type"]).toBe("application/json");
    expect(recorder.lastJson()).toEqual({ thread_id: 1, post_body: "Hello" });
  });

  test("sends a urlencoded body", async () => {
    const recorder = recordFetch();
    await client().request("POST", "/posts", { data: { a: 1, b: "x y", c: [1, 2] } });
    expect(recorder.last().headers["content-type"]).toBe("application/x-www-form-urlencoded");
    const parsed = new URLSearchParams(recorder.last().body as string);
    expect(parsed.get("a")).toBe("1");
    expect(parsed.get("b")).toBe("x y");
    expect(parsed.getAll("c")).toEqual(["1", "2"]);
  });

  test("sends a multipart body without overriding Content-Type", async () => {
    const recorder = recordFetch();
    await client().request("POST", "/users/1/avatar", {
      form: { avatar: new Blob([new Uint8Array([1, 2, 3])]), crop: 128 },
    });
    expect(recorder.last().headers["content-type"]).toBeUndefined();
    const body = recorder.last().body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("crop")).toBe("128");
    expect(body.get("avatar")).toBeInstanceOf(Blob);
  });

  test("converts typed arrays in a multipart body into blobs", async () => {
    const recorder = recordFetch();
    await client().request("POST", "/upload", { form: { file: new Uint8Array([7, 8]) } });
    const body = recorder.last().body as FormData;
    expect(body.get("file")).toBeInstanceOf(Blob);
  });

  test("sends no body for a plain GET", async () => {
    const recorder = recordFetch();
    await client().request("GET", "/threads");
    expect(recorder.last().body).toBeUndefined();
  });
});

describe("LolzteamClient retries", () => {
  test("retries on 429 and returns the eventual success", async () => {
    const recorder = recordFetch((_request, index) =>
      index < 2
        ? jsonResponse({ error: "rate limit" }, 429, { "Retry-After": "0" })
        : jsonResponse({ ok: true })
    );

    const response = await client().request("GET", "/users/me");

    expect(response.status).toBe(200);
    expect(recorder.calls).toHaveLength(3);
  });

  test("retries on 503", async () => {
    const recorder = recordFetch((_request, index) =>
      index < 1 ? jsonResponse({}, 503) : jsonResponse({ ok: true })
    );

    const response = await client({ maxRetries: 2 }).request("GET", "/ping");

    expect(response.status).toBe(200);
    expect(recorder.calls).toHaveLength(2);
  });

  test("gives up after maxRetries and returns the last response", async () => {
    const recorder = recordFetch(() => jsonResponse({}, 429, { "Retry-After": "0" }));

    const response = await client({ maxRetries: 3 }).request("GET", "/ping");

    expect(response.status).toBe(429);
    expect(recorder.calls).toHaveLength(3);
  });

  test("does not retry a 404", async () => {
    const recorder = recordFetch(() => jsonResponse({ error: "not found" }, 404));

    const response = await client().request("GET", "/missing");

    expect(response.status).toBe(404);
    expect(recorder.calls).toHaveLength(1);
  });

  test("honours a custom retryStatuses list", async () => {
    const recorder = recordFetch((_request, index) =>
      index < 1 ? jsonResponse({}, 418) : jsonResponse({ ok: true })
    );

    const response = await client({ retryStatuses: [418] }).request("GET", "/teapot");

    expect(response.status).toBe(200);
    expect(recorder.calls).toHaveLength(2);
  });
});

describe("LolzteamClient failure modes", () => {
  test("wraps a network failure", async () => {
    _setFetch(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(client().request("GET", "/ping")).rejects.toBeInstanceOf(LolzteamNetworkError);
  });

  test("raises a timeout error", async () => {
    installHangingFetch();

    await expect(client({ timeoutMs: 20 }).request("GET", "/slow")).rejects.toBeInstanceOf(
      LolzteamTimeoutError
    );
  });

  test("raises an abort error when the caller aborts", async () => {
    installHangingFetch();

    const controller = new AbortController();
    const pending = client().request("GET", "/slow", { signal: controller.signal });
    controller.abort();

    await expect(pending).rejects.toBeInstanceOf(LolzteamAbortError);
  });

  test("rejects an empty base URL", () => {
    expect(() => new LolzteamClient({ baseUrl: "", token: TOKEN })).toThrow(
      "`baseUrl` is required."
    );
  });
});

describe("LolzteamClient throttling", () => {
  test("spaces consecutive requests by delayMs", async () => {
    recordFetch();
    const instance = client({ delayMs: 60 });

    const started = Date.now();
    await instance.request("GET", "/a");
    await instance.request("GET", "/b");
    const elapsed = Date.now() - started;

    expect(elapsed).toBeGreaterThanOrEqual(50);
  });

  test("does not delay when delayMs is zero", async () => {
    recordFetch();
    const instance = client();

    const started = Date.now();
    await instance.request("GET", "/a");
    await instance.request("GET", "/b");

    expect(Date.now() - started).toBeLessThan(200);
  });
});
