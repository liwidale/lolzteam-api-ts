/**
 * src/forum/index.ts
 * ------------------
 * High level client for the LOLZTEAM Forum API.
 */

import type { BaseClientOptions } from "../core/base.js";
import { ForumAPI } from "./_generated.js";

/** Default Forum API base URL. */
export const FORUM_BASE_URL = "https://prod-api.lolz.live";

/**
 * Alternative Forum API base URLs.
 *
 * Pass one of these as `baseUrl` if the default host is unreachable.
 */
export const FORUM_MIRRORS = [
  "https://prod-api.lolz.live",
  "https://prod-api.zelenka.guru",
  "https://api.lolz.live",
  "https://api.zelenka.guru",
] as const;

/** Options accepted by the {@link Forum} constructor. */
export type ForumOptions = BaseClientOptions;

/** Default minimum delay between two Forum requests, in milliseconds. */
const DEFAULT_DELAY_MS = 500;

type Params<Method extends keyof ForumAPI> = ForumAPI[Method] extends (
  params: infer P
) => unknown
  ? P
  : never;

/**
 * Client for the LOLZTEAM Forum API.
 *
 * Every operation from the official OpenAPI document is available as a method
 * on this class, plus a handful of shorthands and a raw {@link Forum.request}
 * escape hatch.
 *
 * @example
 * ```typescript
 * import { Forum } from "lolzteam-api-ts";
 *
 * const forum = new Forum({ token: process.env.LOLZ_TOKEN! });
 * const response = await forum.Users_Get({ userId: "me" });
 * const { user } = await response.json();
 * ```
 */
export class Forum extends ForumAPI {
  constructor(options: ForumOptions) {
    super(FORUM_BASE_URL, { ...options, delayMs: options.delayMs ?? DEFAULT_DELAY_MS });
  }

  // -- Shorthands -----------------------------------------------------------

  /** Fetch the authenticated user. Shorthand for `Users_Get({ userId: "me" })`. */
  me(params: Omit<NonNullable<Params<"Users_Get">>, "userId"> = {}): Promise<Response> {
    return this.Users_Get({ ...params, userId: "me" });
  }

  /** Fetch a user by id. Shorthand for `Users_Get`. */
  usersGet(params: NonNullable<Params<"Users_Get">>): Promise<Response> {
    return this.Users_Get(params);
  }

  /** List threads. Shorthand for `Threads_List`. */
  threadsList(params: NonNullable<Params<"Threads_List">> = {}): Promise<Response> {
    return this.Threads_List(params);
  }

  /** Create a post. Shorthand for `Posts_Create`. */
  postsCreate(params: NonNullable<Params<"Posts_Create">>): Promise<Response> {
    return this.Posts_Create(params);
  }
}

export { ForumAPI };
