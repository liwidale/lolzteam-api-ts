/**
 * tests/forum.test.ts
 * -------------------
 * Forum client behaviour, with an emphasis on wire name translation: the SDK
 * exposes camelCase parameters but the API expects snake_case.
 */

import { Forum, FORUM_BASE_URL } from "../src/forum/index.js";
import { jsonResponse, recordFetch, restoreFetch } from "./helpers.js";

const TOKEN = "test-token";

function forum(overrides: Partial<ConstructorParameters<typeof Forum>[0]> = {}): Forum {
  return new Forum({ token: TOKEN, delayMs: 0, warnOnRetry: false, ...overrides });
}

afterEach(() => {
  restoreFetch();
});

describe("Forum construction", () => {
  test("targets the production host by default", async () => {
    const recorder = recordFetch();
    await forum().Forums_Grouped();
    expect(recorder.last().url).toBe(`${FORUM_BASE_URL}/forums/grouped`);
  });

  test("accepts a base URL override", async () => {
    const recorder = recordFetch();
    await forum({ baseUrl: "https://api.zelenka.guru" }).Forums_Grouped();
    expect(recorder.last().url).toBe("https://api.zelenka.guru/forums/grouped");
  });

  test("exposes the configured token and language", () => {
    const instance = forum({ language: "ru" });
    expect(instance.token).toBe(TOKEN);
    expect(instance.language).toBe("ru");
  });
});

describe("Forum path parameters", () => {
  test("interpolates a numeric path parameter", async () => {
    const recorder = recordFetch();
    await forum().Users_Get({ userId: 42 });
    expect(new URL(recorder.last().url).pathname).toBe("/users/42");
  });

  test("accepts the `me` shortlink", async () => {
    const recorder = recordFetch();
    await forum().me();
    expect(new URL(recorder.last().url).pathname).toBe("/users/me");
  });

  test("never leaks a path parameter into the query string", async () => {
    const recorder = recordFetch();
    await forum().Users_Get({ userId: 42, fieldsInclude: ["alerts"] });
    const query = recorder.lastQuery();
    expect(query.has("user_id")).toBe(false);
    expect(query.has("userId")).toBe(false);
    expect(query.get("fields_include")).toBe("alerts");
  });
});

describe("Forum query parameters", () => {
  test("translates camelCase parameters into snake_case", async () => {
    const recorder = recordFetch();
    await forum().Categories_List({ parentCategoryId: 7, parentForumId: 9, order: "natural" });

    const query = recorder.lastQuery();
    expect(query.get("parent_category_id")).toBe("7");
    expect(query.get("parent_forum_id")).toBe("9");
    expect(query.get("order")).toBe("natural");
    expect(query.has("parentCategoryId")).toBe(false);
    expect(query.has("parentForumId")).toBe(false);
  });

  test("omits parameters that were not supplied", async () => {
    const recorder = recordFetch();
    await forum().Categories_List({ order: "list" });

    const query = recorder.lastQuery();
    expect([...query.keys()]).toEqual(["order"]);
  });

  test("joins a non-exploded array parameter with commas", async () => {
    const recorder = recordFetch();
    await forum().Threads_List({ fieldsInclude: ["*"] });
    expect(recorder.lastQuery().get("fields_include")).toBe("*");
  });

  test("repeats a bracketed array parameter", async () => {
    const recorder = recordFetch();
    await forum().Threads_List({ prefixIds__: [1, 2] });
    expect(recorder.lastQuery().getAll("prefix_ids[]")).toEqual(["1", "2"]);
  });
});

describe("Forum request bodies", () => {
  test("sends a JSON body with wire names", async () => {
    const recorder = recordFetch();
    await forum().Threads_Create({
      postBody: "Hello world",
      forumId: 876,
      title: "Subject",
      hideContacts: false,
    });

    expect(recorder.last().method).toBe("POST");
    expect(recorder.lastJson()).toEqual({
      post_body: "Hello world",
      forum_id: 876,
      title: "Subject",
      hide_contacts: false,
    });
  });

  test("splits path parameters out of the body", async () => {
    const recorder = recordFetch();
    await forum().Forums_Follow({ forumId: 876, post: true, alert: false });

    expect(new URL(recorder.last().url).pathname).toBe("/forums/876/followers");
    expect(recorder.lastJson()).toEqual({ post: true, alert: false });
  });

  test("uses multipart for the OAuth token endpoint", async () => {
    const recorder = recordFetch();
    await forum().OAuth_Token({
      grantType: "client_credentials",
      clientId: "id",
      clientSecret: "secret",
      scope: ["read", "post"],
    });

    const body = recorder.last().body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("grant_type")).toBe("client_credentials");
    expect(body.get("client_id")).toBe("id");
    expect(body.get("client_secret")).toBe("secret");
    expect(body.getAll("scope")).toEqual(["read", "post"]);
  });
});

describe("Forum shorthands", () => {
  test("usersGet delegates to Users_Get", async () => {
    const recorder = recordFetch();
    const response = await forum().usersGet({ userId: 42 });
    const data = (await response.json()) as { ok: boolean };

    expect(new URL(recorder.last().url).pathname).toBe("/users/42");
    expect(data.ok).toBe(true);
  });

  test("threadsList delegates to Threads_List", async () => {
    const recorder = recordFetch();
    await forum().threadsList({ forumId: 876 });

    expect(new URL(recorder.last().url).pathname).toBe("/threads");
    expect(recorder.lastQuery().get("forum_id")).toBe("876");
  });

  test("postsCreate delegates to Posts_Create", async () => {
    const recorder = recordFetch();
    await forum().postsCreate({ threadId: 123, postBody: "Hello" });

    expect(recorder.lastJson()).toEqual({ thread_id: 123, post_body: "Hello" });
  });
});

describe("Forum runtime settings", () => {
  test("the token setter propagates to the transport", async () => {
    const recorder = recordFetch();
    const instance = forum();
    instance.token = "rotated";
    await instance.Forums_Grouped();

    expect(recorder.last().headers.authorization).toBe("Bearer rotated");
  });

  test("the language setter propagates to the transport", async () => {
    const recorder = recordFetch();
    const instance = forum();
    instance.language = "ru";
    await instance.Forums_Grouped();

    expect(recorder.last().headers["accept-language"]).toBe("ru");
  });

  test("request() reaches an arbitrary endpoint", async () => {
    recordFetch(() => jsonResponse({ raw: true }));
    const response = await forum().request("GET", "/users/me");
    const data = (await response.json()) as { raw: boolean };

    expect(data.raw).toBe(true);
  });

  test("non-2xx responses are returned rather than thrown", async () => {
    recordFetch(() => jsonResponse({ errors: ["Forbidden"] }, 403));
    const response = await forum().Forums_Grouped();

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ errors: ["Forbidden"] });
  });
});
