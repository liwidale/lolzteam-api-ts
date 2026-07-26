/**
 * tests/market.test.ts
 * --------------------
 * Market client behaviour.
 */

import { Market, MARKET_BASE_URL } from "../src/market/index.js";
import { jsonResponse, recordFetch, restoreFetch } from "./helpers.js";

const TOKEN = "test-token";

function market(overrides: Partial<ConstructorParameters<typeof Market>[0]> = {}): Market {
  return new Market({ token: TOKEN, delayMs: 0, warnOnRetry: false, ...overrides });
}

afterEach(() => {
  restoreFetch();
});

describe("Market construction", () => {
  test("targets the production host by default", async () => {
    const recorder = recordFetch();
    await market().Profile_Get();
    expect(recorder.last().url.startsWith(`${MARKET_BASE_URL}/me`)).toBe(true);
  });

  test("accepts a base URL override", async () => {
    const recorder = recordFetch();
    await market({ baseUrl: "https://api.lzt.market" }).Profile_Get();
    expect(recorder.last().url.startsWith("https://api.lzt.market/me")).toBe(true);
  });
});

describe("Market parameters", () => {
  test("interpolates the item id into the path", async () => {
    const recorder = recordFetch();
    await market().Managing_Get({ itemId: 12345678 });
    expect(new URL(recorder.last().url).pathname).toBe("/12345678");
  });

  test("keeps the item id out of the query string", async () => {
    const recorder = recordFetch();
    await market().Managing_Get({ itemId: 12345678, parseSameItemIds: true });

    const query = recorder.lastQuery();
    expect(query.has("item_id")).toBe(false);
    expect(query.get("parse_same_item_ids")).toBe("true");
  });

  test("translates payment history filters", async () => {
    const recorder = recordFetch();
    await market().Payments_History({ type_: "money_transfer", pmin: 10, pmax: 100 });

    const query = recorder.lastQuery();
    expect(query.get("type")).toBe("money_transfer");
    expect(query.get("pmin")).toBe("10");
    expect(query.get("pmax")).toBe("100");
    expect(query.has("type_")).toBe(false);
  });

  test("repeats bracketed array filters", async () => {
    const recorder = recordFetch();
    await market().Category_Steam({ origin__: ["brute", "stealer"] });
    expect(recorder.lastQuery().getAll("origin[]")).toEqual(["brute", "stealer"]);
  });

  test("sends the transfer body with wire names", async () => {
    const recorder = recordFetch();
    await market().Payments_Transfer({
      amount: 100,
      currency: "rub",
      username: "someone",
      comment: "thanks",
      transferHold: false,
    });

    expect(recorder.last().method).toBe("POST");
    expect(recorder.lastJson()).toEqual({
      amount: 100,
      currency: "rub",
      username: "someone",
      comment: "thanks",
      transfer_hold: false,
    });
  });
});

describe("Market shorthands", () => {
  test("me delegates to Profile_Get", async () => {
    const recorder = recordFetch(() => jsonResponse({ user: { user_id: 7 } }));
    const response = await market().me();
    const data = (await response.json()) as { user: { user_id: number } };

    expect(new URL(recorder.last().url).pathname).toBe("/me");
    expect(data.user.user_id).toBe(7);
  });

  test("getItem delegates to Managing_Get", async () => {
    const recorder = recordFetch();
    await market().getItem({ itemId: 999 });
    expect(new URL(recorder.last().url).pathname).toBe("/999");
  });

  test("getPayments delegates to Payments_History", async () => {
    const recorder = recordFetch();
    await market().getPayments({ page: 2 });
    expect(recorder.lastQuery().get("page")).toBe("2");
  });

  test("transfer delegates to Payments_Transfer", async () => {
    const recorder = recordFetch();
    await market().transfer({ amount: 5, currency: "usd", userId: 1 });
    expect(recorder.lastJson()).toEqual({ amount: 5, currency: "usd", user_id: 1 });
  });
});

describe("Market runtime settings", () => {
  test("the token setter propagates to the transport", async () => {
    const recorder = recordFetch();
    const instance = market();
    instance.token = "rotated";
    await instance.Profile_Get();

    expect(recorder.last().headers.authorization).toBe("Bearer rotated");
  });

  test("baseUrl can be changed after construction", async () => {
    const recorder = recordFetch();
    const instance = market();
    instance.baseUrl = "https://api.lzt.market";
    await instance.Profile_Get();

    expect(recorder.last().url.startsWith("https://api.lzt.market/me")).toBe(true);
  });
});
