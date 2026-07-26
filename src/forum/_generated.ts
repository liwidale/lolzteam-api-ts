/* eslint-disable */
/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
 *
 * Source document: codegen/schemas/forum.json
 * Regenerate with: npm run codegen
 */

import { BaseClient } from "../core/base.js";
import type { BinaryInput } from "../core/client.js";

export class ForumAPI extends BaseClient {
  /**
   * Get Access Token
   *
   * Obtain an access token using various grant types.
   *
   * Supports the following grant types:
   * - Client Credentials
   * - Authorization Code
   * - Refresh Token
   * - Password
   *
   * `POST /oauth/token`
   */
  OAuth_Token(params: {
    /**
     * Grant type.
     *
     * Sent as `grant_type`.
     */
    grantType: "client_credentials" | "authorization_code" | "refresh_token" | "password";
    /**
     * Client ID.
     *
     * Sent as `client_id`.
     */
    clientId: string;
    /**
     * Client secret.
     *
     * Sent as `client_secret`.
     */
    clientSecret: string;
    /** Scope. */
    scope?: Array<"basic" | "read" | "post" | "conversate" | "market" | "payment" | "invoice">;
    /** Authorization code. */
    code?: string;
    /**
     * Redirect URI.
     *
     * Sent as `redirect_uri`.
     */
    redirectUri?: string;
    /**
     * Refresh token.
     *
     * Sent as `refresh_token`.
     */
    refreshToken?: string;
    /** Account username/email. */
    username?: string;
    /** Account password. */
    password?: string;
  }): Promise<Response> {
    return this._request("POST", "/oauth/token", {
      form: this._pick(params, {
        grantType: "grant_type",
        clientId: "client_id",
        clientSecret: "client_secret",
        scope: "scope",
        code: "code",
        redirectUri: "redirect_uri",
        refreshToken: "refresh_token",
        username: "username",
        password: "password",
      }),
    });
  }

  /**
   * Get CSS
   *
   * Gets css rulesets for requested selectors.
   *
   * `GET /css`
   */
  Assets_Css(params: {
    /** The names or identifiers of the CSS selectors to retrieve. */
    css?: string[];
  } = {}): Promise<Response> {
    return this._request("GET", "/css", {
      params: this._pick(params, {
        css: ["css", "csv"],
      }),
    });
  }

  /**
   * Get Categories
   *
   * List of all categories in the system.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /categories`
   */
  Categories_List(params: {
    /**
     * Id of parent category. If exists, filter categories that are direct children of that category.
     *
     * Sent as `parent_category_id`.
     */
    parentCategoryId?: number;
    /**
     * Id of parent forum. If exists, filter categories that are direct children of that forum.
     *
     * Sent as `parent_forum_id`.
     */
    parentForumId?: number;
    /** Ordering of categories. */
    order?: "natural" | "list";
  } = {}): Promise<Response> {
    return this._request("GET", "/categories", {
      params: this._pick(params, {
        parentCategoryId: "parent_category_id",
        parentForumId: "parent_forum_id",
        order: "order",
      }),
    });
  }

  /**
   * Get Category
   *
   * Detail information of a category.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /categories/{category_id}`
   */
  Categories_Get(params: {
    /**
     * Id of category.
     *
     * Sent as `category_id`.
     */
    categoryId: number;
  }): Promise<Response> {
    return this._request("GET", `/categories/${this._seg(params.categoryId)}`);
  }

  /**
   * Get Forums
   *
   * List of all forums in the system.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums`
   */
  Forums_List(params: {
    /**
     * Id of parent category. If exists, filter forums that are direct children of that category.
     *
     * Sent as `parent_category_id`.
     */
    parentCategoryId?: number;
    /**
     * Id of parent forum. If exists, filter forums that are direct children of that forum.
     *
     * Sent as `parent_forum_id`.
     */
    parentForumId?: number;
    /** Ordering of forums. */
    order?: "natural" | "list";
  } = {}): Promise<Response> {
    return this._request("GET", "/forums", {
      params: this._pick(params, {
        parentCategoryId: "parent_category_id",
        parentForumId: "parent_forum_id",
        order: "order",
      }),
    });
  }

  /**
   * Get Forums Tree
   *
   * Returns grouped forums.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums/grouped`
   */
  Forums_Grouped(): Promise<Response> {
    return this._request("GET", "/forums/grouped");
  }

  /**
   * Get Forum
   *
   * Detail information of a forum.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums/{forum_id}`
   */
  Forums_Get(params: {
    /**
     * Id of forum.
     *
     * Sent as `forum_id`.
     */
    forumId: number;
  }): Promise<Response> {
    return this._request("GET", `/forums/${this._seg(params.forumId)}`);
  }

  /**
   * Get Followers
   *
   * List of a forum's followers. For privacy reason, only the current user will be included in the list (if the user follows the specified forum).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums/{forum_id}/followers`
   */
  Forums_Followers(params: {
    /**
     * Id of forum.
     *
     * Sent as `forum_id`.
     */
    forumId: number;
  }): Promise<Response> {
    return this._request("GET", `/forums/${this._seg(params.forumId)}/followers`);
  }

  /**
   * Follow Forum
   *
   * Follow a forum.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /forums/{forum_id}/followers`
   */
  Forums_Follow(params: {
    /**
     * Id of forum.
     *
     * Sent as `forum_id`.
     */
    forumId: number;
    /** Whether to receive notification for post. */
    post?: boolean;
    /** Whether to receive notification as alert. */
    alert?: boolean;
    /** Whether to receive notification as email. */
    email?: boolean;
    /**
     * Prefix ids.
     *
     * Sent as `prefix_ids`.
     */
    prefixIds?: number[];
    /**
     * Minimal contest amount. (Only for 766 forumId)
     *
     * Sent as `minimal_contest_amount`.
     */
    minimalContestAmount?: number;
  }): Promise<Response> {
    return this._request("POST", `/forums/${this._seg(params.forumId)}/followers`, {
      json: this._pick(params, {
        post: "post",
        alert: "alert",
        email: "email",
        prefixIds: "prefix_ids",
        minimalContestAmount: "minimal_contest_amount",
      }),
    });
  }

  /**
   * Unfollow Forum
   *
   * Unfollow a forum.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /forums/{forum_id}/followers`
   */
  Forums_Unfollow(params: {
    /**
     * Id of forum.
     *
     * Sent as `forum_id`.
     */
    forumId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/forums/${this._seg(params.forumId)}/followers`);
  }

  /**
   * Get Followed Forums
   *
   * List of followed forums by current user.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums/followed`
   */
  Forums_Followed(params: {
    /** If included in the request, only the forum count is returned as **forums_total**. */
    total?: boolean;
  } = {}): Promise<Response> {
    return this._request("GET", "/forums/followed", {
      params: this._pick(params, {
        total: "total",
      }),
    });
  }

  /**
   * Get Feed Options
   *
   * Returns available options for the forums feed.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /forums/feed/options`
   */
  Forums_GetFeedOptions(): Promise<Response> {
    return this._request("GET", "/forums/feed/options");
  }

  /**
   * Edit Feed Options
   *
   * Edit feed options.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /forums/feed/options`
   */
  Forums_EditFeedOptions(params: {
    /**
     * Array of forum ids to exclude from the feed.
     *
     * Sent as `node_ids`.
     */
    nodeIds?: number[];
    /** List of keywords to exclude specific threads from the feed. */
    keywords?: string[];
  } = {}): Promise<Response> {
    return this._request("PUT", "/forums/feed/options", {
      json: this._pick(params, {
        nodeIds: "node_ids",
        keywords: "keywords",
      }),
    });
  }

  /**
   * Get Links Forum
   *
   * List of all link forums.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /link-forums`
   */
  Links_List(): Promise<Response> {
    return this._request("GET", "/link-forums");
  }

  /**
   * Get Link Forum
   *
   * Detail information of a link forum.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /link-forums/{link_id}`
   */
  Links_Get(params: {
    /**
     * Id of link forum.
     *
     * Sent as `link_id`.
     */
    linkId: number;
  }): Promise<Response> {
    return this._request("GET", `/link-forums/${this._seg(params.linkId)}`);
  }

  /**
   * Get Pages
   *
   * List of all pages in the system.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /pages`
   */
  Pages_List(params: {
    /**
     * Id of parent page. If exists, filter pages that are direct children of that page.
     *
     * Sent as `parent_page_id`.
     */
    parentPageId?: number;
    /** Ordering of pages. */
    order?: "natural" | "list";
  } = {}): Promise<Response> {
    return this._request("GET", "/pages", {
      params: this._pick(params, {
        parentPageId: "parent_page_id",
        order: "order",
      }),
    });
  }

  /**
   * Get Page
   *
   * Detail information of a page.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /pages/{page_id}`
   */
  Pages_Get(params: {
    /**
     * Id of page.
     *
     * Sent as `page_id`.
     */
    pageId: number;
  }): Promise<Response> {
    return this._request("GET", `/pages/${this._seg(params.pageId)}`);
  }

  /**
   * Get Navigation
   *
   * List of navigation elements within the system.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /navigation`
   */
  Navigation_List(params: {
    /** Id of parent element. If exists, filter elements that are direct children of that element. */
    parent?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/navigation", {
      params: this._pick(params, {
        parent: "parent",
      }),
    });
  }

  /**
   * Get Threads
   *
   * List of threads in a forum (with pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads`
   */
  Threads_List(params: {
    /**
     * Id of the containing forum.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /** Tab to get threads from. */
    tab?: string;
    /** Thread state. Works only if **forum_id** is set. */
    state?: "active" | "closed";
    /** Filter to get only threads created within the selected period. Works only if **forum_id** is set. */
    period?: "day" | "week" | "month" | "year";
    /** Thread title. */
    title?: string;
    /**
     * Search only in titles.
     *
     * Sent as `title_only`.
     */
    titleOnly?: boolean;
    /**
     * Filter to get only threads created by the specified user.
     *
     * Sent as `creator_user_id`.
     */
    creatorUserId?: number;
    /** Filter to get only sticky or non-sticky threads. By default, all threads will be included and sticky ones will be at the top of the result on the first page. In mixed mode, sticky threads are not counted towards **threads_total** and does not affect pagination. */
    sticky?: boolean;
    /**
     * Filter to get only threads with the specified prefix.
     *
     * Sent as `prefix_ids[]`.
     */
    prefixIds__?: number[];
    /**
     * Filter to get only threads without the specified prefix.
     *
     * Sent as `prefix_ids_not[]`.
     */
    prefixIdsNot__?: number[];
    /**
     * Filter to get only threads with the specified tag.
     *
     * Sent as `thread_tag_id`.
     */
    threadTagId?: number;
    /** Page number of threads. */
    page?: number;
    /** Number of threads in a page. */
    limit?: number;
    /** Ordering of threads. */
    order?: "post_date" | "last_post_date" | "reply_count" | "reply_count_asc" | "first_post_likes" | "vote_count";
    /** Direction of threads ordering. */
    direction?: "asc" | "desc";
    /**
     * Filter threads by creation date. Only works with 'thread_create_date' and 'thread_create_date_reverse' ordering.
     *
     * Sent as `thread_create_date`.
     */
    threadCreateDate?: number;
    /**
     * Filter threads by update date. Only works with 'thread_update_date' and 'thread_update_date_reverse' ordering.
     *
     * Sent as `thread_update_date`.
     */
    threadUpdateDate?: number;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "latest_posts">;
  } = {}): Promise<Response> {
    return this._request("GET", "/threads", {
      params: this._pick(params, {
        forumId: "forum_id",
        tab: "tab",
        state: "state",
        period: "period",
        title: "title",
        titleOnly: "title_only",
        creatorUserId: "creator_user_id",
        sticky: "sticky",
        prefixIds__: "prefix_ids[]",
        prefixIdsNot__: "prefix_ids_not[]",
        threadTagId: "thread_tag_id",
        page: "page",
        limit: "limit",
        order: "order",
        direction: "direction",
        threadCreateDate: "thread_create_date",
        threadUpdateDate: "thread_update_date",
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Create Thread
   *
   * Create a new thread.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads`
   */
  Threads_Create(params: {
    /**
     * Content of the new thread.
     *
     * Sent as `post_body`.
     */
    postBody: string;
    /**
     * Id of the target forum.
     *
     * Sent as `forum_id`.
     */
    forumId: number;
    /** Thread title. Can be skipped if **title_en** set. */
    title?: string;
    /**
     * Thread english title. Can be skipped if **title** set.
     *
     * Sent as `title_en`.
     */
    titleEn?: string;
    /**
     * Prefix ids.
     *
     * Sent as `prefix_id`.
     */
    prefixId?: number[];
    /** Thread tags. */
    tags?: string[];
    /**
     * Hide contacts.
     *
     * Sent as `hide_contacts`.
     */
    hideContacts?: boolean;
    /**
     * Allow ask hidden content.
     *
     * Sent as `allow_ask_hidden_content`.
     */
    allowAskHiddenContent?: boolean;
    /**
     * Allow to reply only users with chosen or higher group.
     *
     * - `0`: Only staff members and curators can reply in thread
     * - `2`: Everyone can reply in thread
     * - `21`: Local and higher can reply in thread
     * - `22`: Resident or higher can reply in thread
     * - `23`: Expert or higher can reply in thread
     * - `60`: Guru and higher can reply in thread
     * - `351`: Artificial Intelligence and higher can reply in thread
     *
     * @defaultValue `2`
     *
     * Sent as `reply_group`.
     */
    replyGroup?: 0 | 2 | 21 | 22 | 23 | 60 | 351;
    /**
     * Allow commenting if user can't post in thread.
     *
     * Sent as `comment_ignore_group`.
     */
    commentIgnoreGroup?: boolean;
    /**
     * Don't alert followers about thread creation.
     *
     * Sent as `dont_alert_followers`.
     */
    dontAlertFollowers?: boolean;
    /**
     * Date to schedule thread creation (format: `DD-MM-YYYY`).
     *
     * Sent as `schedule_date`.
     */
    scheduleDate?: string;
    /**
     * Time to schedule thread creation (format: `HH:MM`).
     *
     * Sent as `schedule_time`.
     */
    scheduleTime?: string;
    /**
     * Watch thread state.
     *
     * Sent as `watch_thread_state`.
     */
    watchThreadState?: boolean;
    /**
     * Receive forum notifications of new posts in this thread.
     *
     * Sent as `watch_thread`.
     */
    watchThread?: boolean;
    /**
     * Receive email notifications of new posts in this thread.
     *
     * Sent as `watch_thread_email`.
     */
    watchThreadEmail?: boolean;
  }): Promise<Response> {
    return this._request("POST", "/threads", {
      json: this._pick(params, {
        postBody: "post_body",
        forumId: "forum_id",
        title: "title",
        titleEn: "title_en",
        prefixId: "prefix_id",
        tags: "tags",
        hideContacts: "hide_contacts",
        allowAskHiddenContent: "allow_ask_hidden_content",
        replyGroup: "reply_group",
        commentIgnoreGroup: "comment_ignore_group",
        dontAlertFollowers: "dont_alert_followers",
        scheduleDate: "schedule_date",
        scheduleTime: "schedule_time",
        watchThreadState: "watch_thread_state",
        watchThread: "watch_thread",
        watchThreadEmail: "watch_thread_email",
      }),
    });
  }

  /**
   * Create Contest
   *
   * Create a new contest.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /contests`
   */
  Threads_CreateContest(params: {
    /**
     * Content of the new contest.
     *
     * Sent as `post_body`.
     */
    postBody: string;
    /**
     * Contest type.
     *
     * @defaultValue `"by_finish_date"`
     *
     * Sent as `contest_type`.
     */
    contestType: "by_finish_date";
    /**
     * Prize type.
     *
     * Sent as `prize_type`.
     */
    prizeType: "money" | "upgrades";
    /**
     * Sympathies for this week.
     *
     * Sent as `require_like_count`.
     */
    requireLikeCount: number;
    /**
     * Sympathies for all time.
     *
     * Sent as `require_total_like_count`.
     */
    requireTotalLikeCount: number;
    /** Thread title. Can be skipped if **title_en** set. */
    title?: string;
    /**
     * Thread english title. Can be skipped if **title** set.
     *
     * Sent as `title_en`.
     */
    titleEn?: string;
    /**
     * Giveaway duration value. The maximum duration is 3 days. Required if **contest_type** is **by_finish_date**.
     *
     * Sent as `length_value`.
     */
    lengthValue?: number;
    /**
     * Giveaway duration type. The maximum duration is 3 days. Required if **contest_type** is **by_finish_date**.
     *
     * Sent as `length_option`.
     */
    lengthOption?: "minutes" | "hours" | "days";
    /**
     * Winner count (prize count). Optional if **prize_type** is **money**.
     *
     * Sent as `count_winners`.
     */
    countWinners?: number;
    /**
     * How much money will each winner receive. Optional if **prize_type** is **money**.
     *
     * Sent as `prize_data_money`.
     */
    prizeDataMoney?: number;
    /**
     * Enable the distribution of money prizes by places. Optional if **prize_type** is **money**.
     *
     * Sent as `is_money_places`.
     */
    isMoneyPlaces?: boolean;
    /**
     * How much money will receive each place. Required if **is_money_places** is **1**.
     *
     * Sent as `prize_data_places`.
     */
    prizeDataPlaces?: number[];
    /**
     * Which upgrade will each winner receive. Required if **prize_type** is **upgrades**.
     *
     * - `1`: Supreme - 1500 ₽
     * - `6`: Legend - 2999 ₽
     * - `12`: AntiPublic.One Plus subscription - 2000 ₽
     * - `14`: Uniq - 7500 ₽
     * - `17`: 18+ Photo leaks - 6 months - 1200 ₽
     * - `19`: Auto giveaway participation - 1000 ₽
     * - `20`: AntiPublic.one Premium subscription - 5000 ₽
     * - `21`: AntiPublic.one Premium subscription - 500 ₽
     * - `22`: Auto buy on Market - 999 ₽
     *
     * Sent as `prize_data_upgrade`.
     */
    prizeDataUpgrade?: 1 | 6 | 12 | 14 | 17 | 19 | 20 | 21 | 22;
    /**
     * Secret answer of your account.
     *
     * Sent as `secret_answer`.
     */
    secretAnswer?: string;
    /** Thread tags. */
    tags?: string[];
    /**
     * Allow to reply only users with chosen or higher group.
     *
     * - `0`: Only staff members and curators can reply in thread
     * - `2`: Everyone can reply in thread
     * - `21`: Local and higher can reply in thread
     * - `22`: Resident or higher can reply in thread
     * - `23`: Expert or higher can reply in thread
     * - `60`: Guru and higher can reply in thread
     * - `351`: Artificial Intelligence and higher can reply in thread
     *
     * @defaultValue `2`
     *
     * Sent as `reply_group`.
     */
    replyGroup?: 0 | 2 | 21 | 22 | 23 | 60 | 351;
    /**
     * Allow commenting if user can't post in thread.
     *
     * Sent as `comment_ignore_group`.
     */
    commentIgnoreGroup?: boolean;
    /**
     * Don't alert followers about thread creation.
     *
     * Sent as `dont_alert_followers`.
     */
    dontAlertFollowers?: boolean;
    /**
     * Hide contacts.
     *
     * Sent as `hide_contacts`.
     */
    hideContacts?: boolean;
    /**
     * Allow ask hidden content.
     *
     * Sent as `allow_ask_hidden_content`.
     */
    allowAskHiddenContent?: boolean;
    /**
     * Date to schedule thread creation (format: `DD-MM-YYYY`).
     *
     * Sent as `schedule_date`.
     */
    scheduleDate?: string;
    /**
     * Time to schedule thread creation (format: `HH:MM`).
     *
     * Sent as `schedule_time`.
     */
    scheduleTime?: string;
    /**
     * Watch thread state.
     *
     * Sent as `watch_thread_state`.
     */
    watchThreadState?: boolean;
    /**
     * Receive forum notifications of new posts in this thread.
     *
     * Sent as `watch_thread`.
     */
    watchThread?: boolean;
    /**
     * Receive email notifications of new posts in this thread.
     *
     * Sent as `watch_thread_email`.
     */
    watchThreadEmail?: boolean;
  }): Promise<Response> {
    return this._request("POST", "/contests", {
      json: this._pick(params, {
        postBody: "post_body",
        title: "title",
        titleEn: "title_en",
        contestType: "contest_type",
        lengthValue: "length_value",
        lengthOption: "length_option",
        prizeType: "prize_type",
        countWinners: "count_winners",
        prizeDataMoney: "prize_data_money",
        isMoneyPlaces: "is_money_places",
        prizeDataPlaces: "prize_data_places",
        prizeDataUpgrade: "prize_data_upgrade",
        requireLikeCount: "require_like_count",
        requireTotalLikeCount: "require_total_like_count",
        secretAnswer: "secret_answer",
        tags: "tags",
        replyGroup: "reply_group",
        commentIgnoreGroup: "comment_ignore_group",
        dontAlertFollowers: "dont_alert_followers",
        hideContacts: "hide_contacts",
        allowAskHiddenContent: "allow_ask_hidden_content",
        scheduleDate: "schedule_date",
        scheduleTime: "schedule_time",
        watchThreadState: "watch_thread_state",
        watchThread: "watch_thread",
        watchThreadEmail: "watch_thread_email",
      }),
    });
  }

  /**
   * Create Claim
   *
   * Create a Claim.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /claims`
   */
  Threads_Claim(params: {
    /**
     * To whom the complaint is filed. Specify a nickname or a link to the profile.
     *
     * Sent as `as_responder`.
     */
    asResponder: string;
    /**
     * Did you buy account on the market?
     *
     * Sent as `as_is_market_deal`.
     */
    asIsMarketDeal: boolean;
    /**
     * Indicate the amount by which the responder deceived you.
     *
     * Sent as `as_amount`.
     */
    asAmount: number;
    /**
     * The transaction took place through a guarantor or there was a transfer to the market with a hold?
     * Required if **as_is_market_deal** is 0.
     *
     * Sent as `transfer_type`.
     */
    transferType: "guarantor" | "safe" | "notsafe";
    /**
     * You should describe what's happened.
     * - describe the situation in a nutshell. If you wish, you can describe the situation in more detail using the "Spoiler" function.
     * - attach screenshots of correspondence. You may upload to the site [Imgur](https://imgur.com/upload) - for convenience, use Ctrl + V when uploading screenshots to the album.
     * - other evidence;
     * - notify the respondent about the complaint you created, familiarize him with hidden content
     *
     * Describe the situation in as much detail as possible.
     *
     * Sent as `post_body`.
     */
    postBody: string;
    /**
     * Market item id.
     * Required if **as_is_market_deal** is 1.
     *
     * Sent as `as_market_item_id`.
     */
    asMarketItemId?: number;
    /**
     * Contacts and wallets of the responder. Specify the known data about the responder, if any.
     * Optional if **as_is_market_deal** is 0.
     *
     * Sent as `as_data`.
     */
    asData?: string;
    /** Currency of Claim. */
    currency?: "rub" | "uah" | "kzt" | "byn" | "usd" | "eur" | "gbp" | "cny" | "try";
    /**
     * Pay claim fee now or later. (Only for **transfer_type** = **notsafe**)
     *
     * Sent as `pay_claim`.
     */
    payClaim?: "now" | "later";
    /**
     * Funds transfer receipt.
     * Upload a receipt for the transfer of funds, use the "View receipt" button in your wallet. May be uploaded to [Imgur](https://imgur.com/upload). Write "no" if you have not paid.
     * Required if **as_is_market_deal** is 0.
     *
     * Sent as `as_funds_receipt`.
     */
    asFundsReceipt?: string;
    /**
     * Screenshot showing the respondent's Telegram login.
     * If the correspondence was conducted in Telegram, upload a screenshot that will display the respondent's Telegram login against the background of your dialogue. The screenshot may be uploaded to [Imgur](https://imgur.com/upload). If the correspondence was conducted elsewhere, write "no".
     *
     * Sent as `as_tg_login_screenshot`.
     */
    asTgLoginScreenshot?: string;
    /** Thread tags. */
    tags?: string[];
    /**
     * Hide contacts.
     *
     * Sent as `hide_contacts`.
     */
    hideContacts?: boolean;
    /**
     * Allow ask hidden content.
     *
     * Sent as `allow_ask_hidden_content`.
     */
    allowAskHiddenContent?: boolean;
    /**
     * Allow to reply only users with chosen or higher group.
     *
     * - `0`: Only staff members and curators can reply in thread
     * - `2`: Everyone can reply in thread
     * - `21`: Local and higher can reply in thread
     * - `22`: Resident or higher can reply in thread
     * - `23`: Expert or higher can reply in thread
     * - `60`: Guru and higher can reply in thread
     * - `351`: Artificial Intelligence and higher can reply in thread
     *
     * @defaultValue `2`
     *
     * Sent as `reply_group`.
     */
    replyGroup?: 0 | 2 | 21 | 22 | 23 | 60 | 351;
    /**
     * Allow commenting if user can't post in thread.
     *
     * Sent as `comment_ignore_group`.
     */
    commentIgnoreGroup?: boolean;
    /**
     * Don't alert followers about thread creation.
     *
     * Sent as `dont_alert_followers`.
     */
    dontAlertFollowers?: boolean;
    /**
     * Date to schedule thread creation (format: `DD-MM-YYYY`).
     *
     * Sent as `schedule_date`.
     */
    scheduleDate?: string;
    /**
     * Time to schedule thread creation (format: `HH:MM`).
     *
     * Sent as `schedule_time`.
     */
    scheduleTime?: string;
    /**
     * Watch thread state.
     *
     * Sent as `watch_thread_state`.
     */
    watchThreadState?: boolean;
    /**
     * Receive forum notifications of new posts in this thread.
     *
     * Sent as `watch_thread`.
     */
    watchThread?: boolean;
    /**
     * Receive email notifications of new posts in this thread.
     *
     * Sent as `watch_thread_email`.
     */
    watchThreadEmail?: boolean;
  }): Promise<Response> {
    return this._request("POST", "/claims", {
      json: this._pick(params, {
        asResponder: "as_responder",
        asIsMarketDeal: "as_is_market_deal",
        asMarketItemId: "as_market_item_id",
        asData: "as_data",
        asAmount: "as_amount",
        currency: "currency",
        transferType: "transfer_type",
        payClaim: "pay_claim",
        asFundsReceipt: "as_funds_receipt",
        asTgLoginScreenshot: "as_tg_login_screenshot",
        tags: "tags",
        hideContacts: "hide_contacts",
        allowAskHiddenContent: "allow_ask_hidden_content",
        replyGroup: "reply_group",
        commentIgnoreGroup: "comment_ignore_group",
        dontAlertFollowers: "dont_alert_followers",
        scheduleDate: "schedule_date",
        scheduleTime: "schedule_time",
        watchThreadState: "watch_thread_state",
        watchThread: "watch_thread",
        watchThreadEmail: "watch_thread_email",
        postBody: "post_body",
      }),
    });
  }

  /**
   * Get Thread
   *
   * Detail information of a thread.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/{thread_id}`
   */
  Threads_Get(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "latest_posts">;
  }): Promise<Response> {
    return this._request("GET", `/threads/${this._seg(params.threadId)}`, {
      params: this._pick(params, {
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Edit thread
   *
   * Edit a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /threads/{thread_id}`
   */
  Threads_Edit(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /** Thread title. */
    title?: string;
    /**
     * Thread title english.
     *
     * Sent as `title_en`.
     */
    titleEn?: string;
    /**
     * Prefix ids. Set "0" to remove all thread prefixes.
     *
     * Sent as `prefix_id`.
     */
    prefixId?: number[];
    /** Thread tags. */
    tags?: string[];
    /**
     * Discussion state.
     *
     * Sent as `discussion_open`.
     */
    discussionOpen?: boolean;
    /**
     * Hide contacts.
     *
     * Sent as `hide_contacts`.
     */
    hideContacts?: boolean;
    /**
     * Allow ask hidden content.
     *
     * Sent as `allow_ask_hidden_content`.
     */
    allowAskHiddenContent?: boolean;
    /**
     * Allow to reply only users with chosen or higher group.
     *
     * - `0`: Only staff members and curators can reply in thread
     * - `2`: Everyone can reply in thread
     * - `21`: Local and higher can reply in thread
     * - `22`: Resident or higher can reply in thread
     * - `23`: Expert or higher can reply in thread
     * - `60`: Guru and higher can reply in thread
     * - `351`: Artificial Intelligence and higher can reply in thread
     *
     * Sent as `reply_group`.
     */
    replyGroup?: 0 | 2 | 21 | 22 | 23 | 60 | 351;
    /**
     * Allow commenting if user can't post in thread.
     *
     * Sent as `comment_ignore_group`.
     */
    commentIgnoreGroup?: boolean;
  }): Promise<Response> {
    return this._request("PUT", `/threads/${this._seg(params.threadId)}`, {
      json: this._pick(params, {
        title: "title",
        titleEn: "title_en",
        prefixId: "prefix_id",
        tags: "tags",
        discussionOpen: "discussion_open",
        hideContacts: "hide_contacts",
        allowAskHiddenContent: "allow_ask_hidden_content",
        replyGroup: "reply_group",
        commentIgnoreGroup: "comment_ignore_group",
      }),
    });
  }

  /**
   * Delete Thread
   *
   * Delete a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /threads/{thread_id}`
   */
  Threads_Delete(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /** Reason of the thread removal. */
    reason?: string;
  }): Promise<Response> {
    return this._request("DELETE", `/threads/${this._seg(params.threadId)}`, {
      json: this._pick(params, {
        reason: "reason",
      }),
    });
  }

  /**
   * Move Thread
   *
   * Move a thread to another forum.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/move`
   */
  Threads_Move(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /**
     * Forum id.
     *
     * Sent as `node_id`.
     */
    nodeId: string;
    /** Thread title. */
    title?: string;
    /**
     * Thread title english.
     *
     * Sent as `title_en`.
     */
    titleEn?: string;
    /**
     * Prefix ids. Set "0" to remove all thread prefixes.
     *
     * Sent as `prefix_id`.
     */
    prefixId?: number[];
    /**
     * Apply thread prefix.
     *
     * Sent as `apply_thread_prefix`.
     */
    applyThreadPrefix?: boolean;
    /**
     * Send a notification to users who are followed to target node.
     *
     * Sent as `send_alert`.
     */
    sendAlert?: boolean;
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/move`, {
      json: this._pick(params, {
        nodeId: "node_id",
        title: "title",
        titleEn: "title_en",
        prefixId: "prefix_id",
        applyThreadPrefix: "apply_thread_prefix",
        sendAlert: "send_alert",
      }),
    });
  }

  /**
   * Bump Thread
   *
   * Bump a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/bump`
   */
  Threads_Bump(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/bump`);
  }

  /**
   * Hide Thread
   *
   * Hide a thread from your feed.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/hide`
   */
  Threads_Hide(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/hide`);
  }

  /**
   * Bookmark Thread
   *
   * Bookmark a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/star`
   */
  Threads_Star(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/star`);
  }

  /**
   * Unbookmark Thread
   *
   * Unbookmark a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /threads/{thread_id}/star`
   */
  Threads_Unstar(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/threads/${this._seg(params.threadId)}/star`);
  }

  /**
   * Get Thread Followers
   *
   * List of a thread's followers. For privacy reason, only the current user will be included in the list.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/{thread_id}/followers`
   */
  Threads_Followers(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("GET", `/threads/${this._seg(params.threadId)}/followers`);
  }

  /**
   * Follow Thread
   *
   * Follow a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/followers`
   */
  Threads_Follow(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /** Whether to receive notification as email. */
    email?: boolean;
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/followers`, {
      json: this._pick(params, {
        email: "email",
      }),
    });
  }

  /**
   * Unfollow Thread
   *
   * Unfollow a thread.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /threads/{thread_id}/followers`
   */
  Threads_Unfollow(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/threads/${this._seg(params.threadId)}/followers`);
  }

  /**
   * Get Followed Threads
   *
   * List of followed threads by current user.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/followed`
   */
  Threads_Followed(params: {
    /** If included in the request, only the thread count is returned as **threads_total**. */
    total?: boolean;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "latest_posts">;
  } = {}): Promise<Response> {
    return this._request("GET", "/threads/followed", {
      params: this._pick(params, {
        total: "total",
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Get Navigation Elements
   *
   * List of navigation elements to reach the specified thread.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/{thread_id}/navigation`
   */
  Threads_Navigation(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("GET", `/threads/${this._seg(params.threadId)}/navigation`);
  }

  /**
   * Get Poll
   *
   * Detail information of a poll.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/{thread_id}/poll`
   */
  Threads_Poll_Get(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("GET", `/threads/${this._seg(params.threadId)}/poll`);
  }

  /**
   * Vote Poll
   *
   * Vote on a thread poll.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /threads/{thread_id}/poll/votes`
   */
  Threads_Poll_Vote(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
    /**
     * The id of the response to vote for. Can be skipped if **response_ids** set.
     *
     * Sent as `response_id`.
     */
    responseId?: number;
    /**
     * An array of ids of responses (if the poll allows multiple choices).
     *
     * Sent as `response_ids`.
     */
    responseIds?: number[];
  }): Promise<Response> {
    return this._request("POST", `/threads/${this._seg(params.threadId)}/poll/votes`, {
      json: this._pick(params, {
        responseId: "response_id",
        responseIds: "response_ids",
      }),
    });
  }

  /**
   * Get Unread Threads
   *
   * List of unread threads (must be logged in).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/new`
   */
  Threads_Unread(params: {
    /** Maximum number of result threads. The limit may get decreased if the value is too large (depending on the system configuration). */
    limit?: number;
    /**
     * Id of the container forum to search for threads. Child forums of the specified forum will be included in the search.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /**
     * Number of thread data to be returned. Default value is 20.
     *
     * Sent as `data_limit`.
     */
    dataLimit?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/threads/new", {
      params: this._pick(params, {
        limit: "limit",
        forumId: "forum_id",
        dataLimit: "data_limit",
      }),
    });
  }

  /**
   * Get Recent Threads
   *
   * List of recent threads.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /threads/recent`
   */
  Threads_Recent(params: {
    /** Maximum number of days to search for threads. */
    days?: number;
    /** Maximum number of result threads. The limit may get decreased if the value is too large. */
    limit?: number;
    /**
     * Id of the container forum to search for threads. Child forums of the specified forum will be included in the search.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /**
     * Number of thread data to be returned. Default value is 20.
     *
     * Sent as `data_limit`.
     */
    dataLimit?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/threads/recent", {
      params: this._pick(params, {
        days: "days",
        limit: "limit",
        forumId: "forum_id",
        dataLimit: "data_limit",
      }),
    });
  }

  /**
   * Finish Contest
   *
   * Finishes a contest.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /contests/{thread_id}/finish`
   */
  Threads_Finish(params: {
    /**
     * Id of thread.
     *
     * Sent as `thread_id`.
     */
    threadId: number;
  }): Promise<Response> {
    return this._request("POST", `/contests/${this._seg(params.threadId)}/finish`);
  }

  /**
   * Get Posts
   *
   * List of posts in a thread (with pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /posts`
   */
  Posts_List(params: {
    /**
     * Id of the containing thread.
     *
     * Sent as `thread_id`.
     */
    threadId?: number;
    /**
     * Id of a post, posts that are in the same page with the specified post will be returned. **thread_id** may be skipped.
     *
     * Sent as `page_of_post_id`.
     */
    pageOfPostId?: number;
    /** Page number of posts. */
    page?: number;
    /** Number of posts in a page. */
    limit?: number;
    /** Ordering of posts. */
    order?: "natural" | "natural_reverse" | "post_likes" | "post_likes_reverse";
  } = {}): Promise<Response> {
    return this._request("GET", "/posts", {
      params: this._pick(params, {
        threadId: "thread_id",
        pageOfPostId: "page_of_post_id",
        page: "page",
        limit: "limit",
        order: "order",
      }),
    });
  }

  /**
   * Create Post
   *
   * Create a new post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /posts`
   */
  Posts_Create(params: {
    /**
     * Content of the new post.
     *
     * Sent as `post_body`.
     */
    postBody: string;
    /**
     * Id of the target thread. **quote_post_id** can be skipped if this parameter is provided.
     *
     * Sent as `thread_id`.
     */
    threadId?: number;
    /**
     * Id of the quote post. **thread_id** can be skipped if this parameter is provided.
     *
     * Sent as `quote_post_id`.
     */
    quotePostId?: number;
  }): Promise<Response> {
    return this._request("POST", "/posts", {
      json: this._pick(params, {
        postBody: "post_body",
        threadId: "thread_id",
        quotePostId: "quote_post_id",
      }),
    });
  }

  /**
   * Get Post
   *
   * Detail information of a post.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /posts/{post_id}`
   */
  Posts_Get(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
  }): Promise<Response> {
    return this._request("GET", `/posts/${this._seg(params.postId)}`);
  }

  /**
   * Edit Post
   *
   * Edit a post.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /posts/{post_id}`
   */
  Posts_Edit(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /**
     * Content of the post.
     *
     * Sent as `post_body`.
     */
    postBody?: string;
  }): Promise<Response> {
    return this._request("PUT", `/posts/${this._seg(params.postId)}`, {
      json: this._pick(params, {
        postBody: "post_body",
      }),
    });
  }

  /**
   * Delete Post
   *
   * Delete a post.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /posts/{post_id}`
   */
  Posts_Delete(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /** Reason of the post removal. */
    reason?: string;
  }): Promise<Response> {
    return this._request("DELETE", `/posts/${this._seg(params.postId)}`, {
      json: this._pick(params, {
        reason: "reason",
      }),
    });
  }

  /**
   * Get Post Likes
   *
   * List of users who liked a post.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /posts/{post_id}/likes`
   */
  Posts_Likes(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /** Page number of users. */
    page?: number;
    /** Number of users in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/posts/${this._seg(params.postId)}/likes`, {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Like Post
   *
   * Like a post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /posts/{post_id}/likes`
   */
  Posts_Like(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
  }): Promise<Response> {
    return this._request("POST", `/posts/${this._seg(params.postId)}/likes`);
  }

  /**
   * Unlike Post
   *
   * Unlike a post.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /posts/{post_id}/likes`
   */
  Posts_Unlike(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/posts/${this._seg(params.postId)}/likes`);
  }

  /**
   * Get Post Report Reasons
   *
   * Get post report reasons.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /posts/{post_id}/report`
   */
  Posts_ReportReasons(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
  }): Promise<Response> {
    return this._request("GET", `/posts/${this._seg(params.postId)}/report`);
  }

  /**
   * Report Post
   *
   * Report a post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /posts/{post_id}/report`
   */
  Posts_Report(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /** Reason of the report. */
    message: string;
  }): Promise<Response> {
    return this._request("POST", `/posts/${this._seg(params.postId)}/report`, {
      json: this._pick(params, {
        message: "message",
      }),
    });
  }

  /**
   * Get Post Comments
   *
   * List of post comments in a thread.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /posts/comments`
   */
  Posts_Comments_Get(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /** The time in milliseconds (e.g. 1652177794083) before last comment date. */
    before?: number;
    /**
     * Comment id to get older comments.
     *
     * Sent as `before_comment`.
     */
    beforeComment?: number;
  }): Promise<Response> {
    return this._request("GET", "/posts/comments", {
      params: this._pick(params, {
        postId: "post_id",
        before: "before",
        beforeComment: "before_comment",
      }),
    });
  }

  /**
   * Create Post Comment
   *
   * Create a post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /posts/comments`
   */
  Posts_Comments_Create(params: {
    /**
     * Id of post.
     *
     * Sent as `post_id`.
     */
    postId: number;
    /**
     * Content of the a post comment.
     *
     * Sent as `comment_body`.
     */
    commentBody: string;
  }): Promise<Response> {
    return this._request("POST", "/posts/comments", {
      json: this._pick(params, {
        postId: "post_id",
        commentBody: "comment_body",
      }),
    });
  }

  /**
   * Edit Post Comment
   *
   * Edit a post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /posts/comments`
   */
  Posts_Comments_Edit(params: {
    /**
     * Id of post.
     *
     * Sent as `post_comment_id`.
     */
    postCommentId: number;
    /**
     * Content of the new post comment.
     *
     * Sent as `comment_body`.
     */
    commentBody: string;
  }): Promise<Response> {
    return this._request("PUT", "/posts/comments", {
      json: this._pick(params, {
        postCommentId: "post_comment_id",
        commentBody: "comment_body",
      }),
    });
  }

  /**
   * Delete Post Comment
   *
   * Delete a post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /posts/comments`
   */
  Posts_Comments_Delete(params: {
    /**
     * Id of post comment.
     *
     * Sent as `post_comment_id`.
     */
    postCommentId: number;
    /** Reason of a post comment removal. */
    reason?: string;
  }): Promise<Response> {
    return this._request("DELETE", "/posts/comments", {
      json: this._pick(params, {
        postCommentId: "post_comment_id",
        reason: "reason",
      }),
    });
  }

  /**
   * Report Post Comment
   *
   * Report a post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /posts/comments/report`
   */
  Posts_Comments_Report(params: {
    /**
     * Id of post comment.
     *
     * Sent as `post_comment_id`.
     */
    postCommentId: number;
    /** Reason of the report. */
    message: string;
  }): Promise<Response> {
    return this._request("POST", "/posts/comments/report", {
      json: this._pick(params, {
        postCommentId: "post_comment_id",
        message: "message",
      }),
    });
  }

  /**
   * Get Users
   *
   * List of users (with pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users`
   */
  Users_List(params: {
    /** Page number of users. */
    page?: number;
    /** Number of users in a page. */
    limit?: number;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "alerts">;
  } = {}): Promise<Response> {
    return this._request("GET", "/users", {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Get User Fields
   *
   * List of user fields.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/fields`
   */
  Users_Fields(): Promise<Response> {
    return this._request("GET", "/users/fields");
  }

  /**
   * Find Users
   *
   * List of users filtered by username, email or custom fields.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/find`
   */
  Users_Find(params: {
    /** Username to filter. Usernames start with the query will be returned. */
    username?: string;
    /**
     * Custom fields to filter. Example: **custom_fields[telegram]=telegramLogin**.
     *
     * Sent as `custom_fields`.
     */
    customFields?: Record<string, unknown>;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "alerts">;
  } = {}): Promise<Response> {
    return this._request("GET", "/users/find", {
      params: this._pick(params, {
        username: "username",
        customFields: "custom_fields",
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Get User
   *
   * Detail information of a user.
   *
   * Required scopes:
   * + **read**
   * + **basic**
   *
   * `GET /users/{user_id}`
   */
  Users_Get(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "alerts">;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}`, {
      params: this._pick(params, {
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Edit User
   *
   * Edit a user.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /users/{user_id}`
   */
  Users_Edit(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** New username. */
    username?: string;
    /**
     * New custom title of the user.
     *
     * Sent as `user_title`.
     */
    userTitle?: string;
    /**
     * Id of the group you want to display.
     *
     * Sent as `display_group_id`.
     */
    displayGroupId?: number;
    /**
     * Id of the icon group you want to display.
     *
     * Sent as `display_icon_group_id`.
     */
    displayIconGroupId?: number;
    /**
     * Id of the banner you want to display.
     *
     * Sent as `display_banner_id`.
     */
    displayBannerId?: number;
    /**
     * This message is shown when someone wants to write to you.
     *
     * Sent as `conv_welcome_message`.
     */
    convWelcomeMessage?: string;
    /**
     * Your date of birth (day).
     *
     * Sent as `user_dob_day`.
     */
    userDobDay?: number;
    /**
     * Your date of birth (month).
     *
     * Sent as `user_dob_month`.
     */
    userDobMonth?: number;
    /**
     * Your date of birth (year).
     *
     * Sent as `user_dob_year`.
     */
    userDobYear?: number;
    /**
     * Secret answer.
     *
     * Sent as `secret_answer`.
     */
    secretAnswer?: string;
    /**
     * Secret answer type.
     *
     * Sent as `secret_answer_type`.
     */
    secretAnswerType?: number;
    /**
     * Profile short link.
     *
     * Sent as `short_link`.
     */
    shortLink?: string;
    /**
     * User interface language ID.
     *
     * - `1`: English
     * - `2`: Russian
     *
     * Sent as `language_id`.
     */
    languageId?: 1 | 2;
    /** User gender. */
    gender?: "" | "male" | "female";
    /** User timezone. */
    timezone?: "Pacific/Midway" | "Pacific/Honolulu" | "Pacific/Marquesas" | "America/Anchorage" | "America/Los_Angeles" | "America/Santa_Isabel" | "America/Tijuana" | "America/Denver" | "America/Chihuahua" | "America/Phoenix" | "America/Chicago" | "America/Belize" | "America/Mexico_City" | "Pacific/Easter" | "America/New_York" | "America/Havana" | "America/Bogota" | "America/Caracas" | "America/Halifax" | "America/Goose_Bay" | "America/Asuncion" | "America/Santiago" | "America/Cuiaba" | "America/La_Paz" | "America/St_Johns" | "America/Argentina/Buenos_Aires" | "America/Argentina/San_Luis" | "America/Argentina/Mendoza" | "Atlantic/Stanley" | "America/Godthab" | "America/Montevideo" | "America/Sao_Paulo" | "America/Miquelon" | "America/Noronha" | "Atlantic/Cape_Verde" | "Atlantic/Azores" | "Europe/London" | "Africa/Casablanca" | "Atlantic/Reykjavik" | "Europe/Amsterdam" | "Africa/Algiers" | "Africa/Windhoek" | "Africa/Tunis" | "Europe/Athens" | "Africa/Johannesburg" | "Europe/Kaliningrad" | "Asia/Amman" | "Asia/Beirut" | "Africa/Cairo" | "Asia/Jerusalem" | "Asia/Gaza" | "Asia/Damascus" | "Europe/Moscow" | "Europe/Minsk" | "Africa/Nairobi" | "Asia/Tehran" | "Asia/Dubai" | "Asia/Yerevan" | "Asia/Baku" | "Indian/Mauritius" | "Asia/Kabul" | "Asia/Yekaterinburg" | "Asia/Tashkent" | "Asia/Kolkata" | "Asia/Kathmandu" | "Asia/Novosibirsk" | "Asia/Dhaka" | "Asia/Almaty" | "Asia/Rangoon" | "Asia/Krasnoyarsk" | "Asia/Bangkok" | "Asia/Irkutsk" | "Asia/Hong_Kong" | "Asia/Singapore" | "Australia/Perth" | "Asia/Yakutsk" | "Asia/Tokyo" | "Asia/Seoul" | "Australia/Adelaide" | "Australia/Darwin" | "Asia/Vladivostok" | "Asia/Magadan" | "Australia/Brisbane" | "Australia/Sydney" | "Pacific/Noumea" | "Pacific/Norfolk" | "Asia/Anadyr" | "Pacific/Auckland" | "Pacific/Fiji" | "Pacific/Chatham" | "Pacific/Tongatapu" | "Pacific/Apia" | "Pacific/Kiritimati";
    /**
     * Whether to receive admin emails.
     *
     * Sent as `receive_admin_email`.
     */
    receiveAdminEmail?: boolean;
    /**
     * Whether user activity is visible.
     *
     * Sent as `activity_visible`.
     */
    activityVisible?: boolean;
    /**
     * Show date of birth (day and month).
     *
     * Sent as `show_dob_date`.
     */
    showDobDate?: boolean;
    /**
     * Show year of birth.
     *
     * Sent as `show_dob_year`.
     */
    showDobYear?: boolean;
    /**
     * Hide username change logs.
     *
     * Sent as `hide_username_change_logs`.
     */
    hideUsernameChangeLogs?: boolean;
    /**
     * Who can view your profile.
     *
     * Sent as `allow_view_profile`.
     */
    allowViewProfile?: "none" | "members" | "followed";
    /**
     * Who can post on your profile.
     *
     * Sent as `allow_post_profile`.
     */
    allowPostProfile?: "none" | "members" | "followed";
    /**
     * Who can send you personal conversations.
     *
     * Sent as `allow_send_personal_conversation`.
     */
    allowSendPersonalConversation?: "none" | "members" | "followed";
    /**
     * Who can invite you to groups.
     *
     * Sent as `allow_invite_group`.
     */
    allowInviteGroup?: "none" | "members" | "followed";
    /**
     * Who can see your news feed.
     *
     * Sent as `allow_receive_news_feed`.
     */
    allowReceiveNewsFeed?: "none" | "members" | "followed";
    /** Alert settings. */
    alert?: Record<string, unknown>;
    /** Custom user profile fields. */
    fields?: Record<string, unknown>;
  }): Promise<Response> {
    return this._request("PUT", `/users/${this._seg(params.userId)}`, {
      json: this._pick(params, {
        username: "username",
        userTitle: "user_title",
        displayGroupId: "display_group_id",
        displayIconGroupId: "display_icon_group_id",
        displayBannerId: "display_banner_id",
        convWelcomeMessage: "conv_welcome_message",
        userDobDay: "user_dob_day",
        userDobMonth: "user_dob_month",
        userDobYear: "user_dob_year",
        secretAnswer: "secret_answer",
        secretAnswerType: "secret_answer_type",
        shortLink: "short_link",
        languageId: "language_id",
        gender: "gender",
        timezone: "timezone",
        receiveAdminEmail: "receive_admin_email",
        activityVisible: "activity_visible",
        showDobDate: "show_dob_date",
        showDobYear: "show_dob_year",
        hideUsernameChangeLogs: "hide_username_change_logs",
        allowViewProfile: "allow_view_profile",
        allowPostProfile: "allow_post_profile",
        allowSendPersonalConversation: "allow_send_personal_conversation",
        allowInviteGroup: "allow_invite_group",
        allowReceiveNewsFeed: "allow_receive_news_feed",
        alert: "alert",
        fields: "fields",
      }),
    });
  }

  /**
   * Get User Claims
   *
   * Get user claims.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/claims`
   */
  Users_Claims(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /**
     * Filter claims by their type.
     *
     * Sent as `type`.
     */
    type_?: "market" | "nomarket";
    /**
     * Filter claims by their state.
     *
     * Sent as `claim_state`.
     */
    claimState?: "active" | "solved" | "rejected" | "settled";
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/claims`, {
      params: this._pick(params, {
        type_: "type",
        claimState: "claim_state",
      }),
    });
  }

  /**
   * Upload Avatar
   *
   * Upload avatar for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/avatar`
   */
  Users_Avatar_Upload(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** Binary data of the avatar. */
    avatar: BinaryInput;
    /** The starting point of the selection by width. Default value - 0 */
    x?: number;
    /** The starting point of the selection by height. Default value - 0 */
    y?: number;
    /** Selection size. */
    crop?: number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/avatar`, {
      form: this._pick(params, {
        avatar: "avatar",
        x: "x",
        y: "y",
        crop: "crop",
      }),
    });
  }

  /**
   * Delete Avatar
   *
   * Delete avatar for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /users/{user_id}/avatar`
   */
  Users_Avatar_Delete(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("DELETE", `/users/${this._seg(params.userId)}/avatar`);
  }

  /**
   * Crop Avatar
   *
   * Crop avatar for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/avatar/crop`
   */
  Users_Avatar_Crop(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** The starting point of the selection by width. Default value - 0 */
    x?: number;
    /** The starting point of the selection by height. Default value - 0 */
    y?: number;
    /** Selection size. */
    crop?: number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/avatar/crop`, {
      json: this._pick(params, {
        x: "x",
        y: "y",
        crop: "crop",
      }),
    });
  }

  /**
   * Upload Background
   *
   * Upload background for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/background`
   */
  Users_Background_Upload(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** Binary data of the background. Background image must be 1920x1080 pixels */
    background: BinaryInput;
    /** The starting point of the selection by width. Default value - 0 */
    x?: number;
    /** The starting point of the selection by height. Default value - 0 */
    y?: number;
    /** Selection size. */
    crop?: number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/background`, {
      form: this._pick(params, {
        background: "background",
        x: "x",
        y: "y",
        crop: "crop",
      }),
    });
  }

  /**
   * Delete Background
   *
   * Delete background for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /users/{user_id}/background`
   */
  Users_Background_Delete(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("DELETE", `/users/${this._seg(params.userId)}/background`);
  }

  /**
   * Crop Background
   *
   * Crop background for a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/background/crop`
   */
  Users_Background_Crop(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** The starting point of the selection by width. Default value - 0 */
    x?: number;
    /** The starting point of the selection by height. Default value - 0 */
    y?: number;
    /** Selection size. */
    crop?: number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/background/crop`, {
      json: this._pick(params, {
        x: "x",
        y: "y",
        crop: "crop",
      }),
    });
  }

  /**
   * Get User Followers
   *
   * List of a user's followers.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/followers`
   */
  Users_Followers(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** Ordering of followers. */
    order?: "natural" | "follow_date" | "follow_date_reverse";
    /** Page number of followers. */
    page?: number;
    /** Number of followers in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/followers`, {
      params: this._pick(params, {
        order: "order",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Follow User
   *
   * Follow a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/followers`
   */
  Users_Follow(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/followers`);
  }

  /**
   * Unfollow User
   *
   * Unfollow a user.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /users/{user_id}/followers`
   */
  Users_Unfollow(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("DELETE", `/users/${this._seg(params.userId)}/followers`);
  }

  /**
   * Get Followed Users By User
   *
   * List of users whom are followed by a user.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/followings`
   */
  Users_Followings(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** Ordering of users. */
    order?: "natural" | "follow_date" | "follow_date_reverse";
    /** Page number of users. */
    page?: number;
    /** Number of users in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/followings`, {
      params: this._pick(params, {
        order: "order",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get User Likes
   *
   * Get information about user likes.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/likes`
   */
  Users_Likes(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /**
     * Filter by forum section.
     *
     * Sent as `node_id`.
     */
    nodeId?: number;
    /**
     * Like type.
     *
     * - `like`: Sympathies
     * - `like2`: Likes
     *
     * Sent as `like_type`.
     */
    likeType?: "like" | "like2";
    /**
     * Likes type.
     *
     * @defaultValue `"gotten"`
     *
     * Sent as `type`.
     */
    type_?: "gotten" | "given";
    /** Page number. */
    page?: number;
    /**
     * Content type.
     *
     * @defaultValue `"post"`
     *
     * Sent as `content_type`.
     */
    contentType?: "post" | "post_comment" | "profile_post" | "profile_post_comment";
    /**
     * Get only likes from specified user.
     *
     * Sent as `search_user_id`.
     */
    searchUserId?: number;
    /** Show weekly statistics. */
    stats?: boolean;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/likes`, {
      params: this._pick(params, {
        nodeId: "node_id",
        likeType: "like_type",
        type_: "type",
        page: "page",
        contentType: "content_type",
        searchUserId: "search_user_id",
        stats: "stats",
      }),
    });
  }

  /**
   * Get Ignored Users
   *
   * List of ignored users of current user.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/ignored`
   */
  Users_Ignored(params: {
    /** If included in the request, only the user count is returned as **users_total**. */
    total?: boolean;
  } = {}): Promise<Response> {
    return this._request("GET", "/users/ignored", {
      params: this._pick(params, {
        total: "total",
      }),
    });
  }

  /**
   * Ignore User
   *
   * Ignore a user.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /users/{user_id}/ignore`
   */
  Users_Ignore(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("POST", `/users/${this._seg(params.userId)}/ignore`);
  }

  /**
   * Edit Ignoring Options
   *
   * Edit ignoring options.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /users/{user_id}/ignore`
   */
  Users_IgnoreEdit(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /**
     * Ignore user's conversations.
     *
     * Sent as `ignore_conversations`.
     */
    ignoreConversations?: boolean;
    /**
     * Ignore user's content.
     *
     * Sent as `ignore_content`.
     */
    ignoreContent?: boolean;
    /**
     * Restrict user from viewing your profile.
     *
     * Sent as `restrict_view_profile`.
     */
    restrictViewProfile?: boolean;
  }): Promise<Response> {
    return this._request("PUT", `/users/${this._seg(params.userId)}/ignore`, {
      params: this._pick(params, {
        ignoreConversations: "ignore_conversations",
        ignoreContent: "ignore_content",
        restrictViewProfile: "restrict_view_profile",
      }),
    });
  }

  /**
   * Unignore User
   *
   * Stop ignoring a user.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /users/{user_id}/ignore`
   */
  Users_Unignore(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("DELETE", `/users/${this._seg(params.userId)}/ignore`);
  }

  /**
   * Get Contents
   *
   * List of contents created by user (with pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/timeline`
   */
  Users_Contents(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /** Page number of contents. */
    page?: number;
    /** Number of contents in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/timeline`, {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get Trophies
   *
   * List of user trophies.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/trophies`
   */
  Users_Trophies(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/trophies`);
  }

  /**
   * Get Secret Answer Types
   *
   * Get available secret answer types for user account security.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/secret-answer/types`
   */
  Users_SecretAnswerTypes(): Promise<Response> {
    return this._request("GET", "/users/secret-answer/types");
  }

  /**
   * Reset Secret Answer
   *
   * Request a reset of the secret answer for the account.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /account/secret-answer/reset`
   */
  Users_SA_Reset(): Promise<Response> {
    return this._request("POST", "/account/secret-answer/reset");
  }

  /**
   * Cancel Secret Answer Reset
   *
   * Cancel a pending secret answer reset request for the account.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /account/secret-answer/reset`
   */
  Users_SA_CancelReset(): Promise<Response> {
    return this._request("DELETE", "/account/secret-answer/reset");
  }

  /**
   * Get Profile Posts
   *
   * List of profile posts (with pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /users/{user_id}/profile-posts`
   */
  ProfilePosts_List(params: {
    /**
     * User ID.
     * > You can use shortlink `me` to interact with your profile.
     *
     * Sent as `user_id`.
     */
    userId: string | number;
    /**
     * Filter to get only posts from the specified user.
     *
     * Sent as `posts_user_id`.
     */
    postsUserId?: number;
    /** Page number of contents. */
    page?: number;
    /** Number of contents in a page. */
    limit?: number;
    /**
     * List of fields to include.
     *
     * Sent as `fields_include`.
     */
    fieldsInclude?: Array<"*" | "latest_comments">;
  }): Promise<Response> {
    return this._request("GET", `/users/${this._seg(params.userId)}/profile-posts`, {
      params: this._pick(params, {
        postsUserId: "posts_user_id",
        page: "page",
        limit: "limit",
        fieldsInclude: ["fields_include", "csv"],
      }),
    });
  }

  /**
   * Get Profile Post
   *
   * Detail information of a profile post.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /profile-posts/{profile_post_id}`
   */
  ProfilePosts_Get(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("GET", `/profile-posts/${this._seg(params.profilePostId)}`);
  }

  /**
   * Edit Profile Post
   *
   * Edit a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /profile-posts/{profile_post_id}`
   */
  ProfilePosts_Edit(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /**
     * New content of the profile post.
     *
     * Sent as `post_body`.
     */
    postBody?: string;
    /**
     * Disable comments.
     *
     * Sent as `disable_comments`.
     */
    disableComments?: boolean;
  }): Promise<Response> {
    return this._request("PUT", `/profile-posts/${this._seg(params.profilePostId)}`, {
      json: this._pick(params, {
        postBody: "post_body",
        disableComments: "disable_comments",
      }),
    });
  }

  /**
   * Delete Profile Post
   *
   * Delete a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /profile-posts/{profile_post_id}`
   */
  ProfilePosts_Delete(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /** Reason of the profile post removal. */
    reason?: string;
  }): Promise<Response> {
    return this._request("DELETE", `/profile-posts/${this._seg(params.profilePostId)}`, {
      params: this._pick(params, {
        reason: "reason",
      }),
    });
  }

  /**
   * Get Profile Post Report Reasons
   *
   * Get Profile Post Report Reasons.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /profile-posts/{profile_post_id}/report`
   */
  ProfilePosts_ReportReasons(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("GET", `/profile-posts/${this._seg(params.profilePostId)}/report`);
  }

  /**
   * Report a Profile Post
   *
   * Report a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts/{profile_post_id}/report`
   */
  ProfilePosts_Report(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /** Reason of the report. */
    message: string;
  }): Promise<Response> {
    return this._request("POST", `/profile-posts/${this._seg(params.profilePostId)}/report`, {
      json: this._pick(params, {
        message: "message",
      }),
    });
  }

  /**
   * Create Profile Post
   *
   * Create a profile post on a user profile.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts`
   */
  ProfilePosts_Create(params: {
    /** Sent as `user_id`. */
    userId: string | number;
    /**
     * Content of a profile post.
     *
     * Sent as `post_body`.
     */
    postBody: string;
  }): Promise<Response> {
    return this._request("POST", "/profile-posts", {
      json: this._pick(params, {
        userId: "user_id",
        postBody: "post_body",
      }),
    });
  }

  /**
   * Stick Profile Post
   *
   * Stick a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts/{profile_post_id}/stick`
   */
  ProfilePosts_Stick(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("POST", `/profile-posts/${this._seg(params.profilePostId)}/stick`);
  }

  /**
   * Unstick Profile Post
   *
   * Unstick a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /profile-posts/{profile_post_id}/stick`
   */
  ProfilePosts_Unstick(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/profile-posts/${this._seg(params.profilePostId)}/stick`);
  }

  /**
   * Get Profile Post Likes
   *
   * List of users who liked a profile post.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /profile-posts/{profile_post_id}/likes`
   */
  ProfilePosts_Likes(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("GET", `/profile-posts/${this._seg(params.profilePostId)}/likes`);
  }

  /**
   * Like Profile Post
   *
   * Like a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts/{profile_post_id}/likes`
   */
  ProfilePosts_Like(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("POST", `/profile-posts/${this._seg(params.profilePostId)}/likes`);
  }

  /**
   * Unlike Profile Post
   *
   * Unlike a profile post.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /profile-posts/{profile_post_id}/likes`
   */
  ProfilePosts_Unlike(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/profile-posts/${this._seg(params.profilePostId)}/likes`);
  }

  /**
   * Get Profile Post Comments
   *
   * List of comments of a profile post.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /profile-posts/comments`
   */
  ProfilePosts_Comments_List(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /** Date to get older comments. Please note that this entry point does not support the page parameter but it still does support **limit**. */
    before?: number;
    /** Number of profile posts in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", "/profile-posts/comments", {
      params: this._pick(params, {
        profilePostId: "profile_post_id",
        before: "before",
        limit: "limit",
      }),
    });
  }

  /**
   * Create Profile Post Comment
   *
   * Create a new profile post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts/comments`
   */
  ProfilePosts_Comments_Create(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /**
     * Content of the new profile post comment.
     *
     * Sent as `comment_body`.
     */
    commentBody: string;
  }): Promise<Response> {
    return this._request("POST", "/profile-posts/comments", {
      json: this._pick(params, {
        profilePostId: "profile_post_id",
        commentBody: "comment_body",
      }),
    });
  }

  /**
   * Edit Profile Post Comment
   *
   * Edit a profile post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `PUT /profile-posts/comments`
   */
  ProfilePosts_Comments_Edit(params: {
    /**
     * Id of profile post comment.
     *
     * Sent as `comment_id`.
     */
    commentId: number;
    /**
     * New content for the profile post comment.
     *
     * Sent as `comment_body`.
     */
    commentBody: string;
  }): Promise<Response> {
    return this._request("PUT", "/profile-posts/comments", {
      json: this._pick(params, {
        commentId: "comment_id",
        commentBody: "comment_body",
      }),
    });
  }

  /**
   * Delete Profile Post Comment
   *
   * Delete a profile post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `DELETE /profile-posts/comments`
   */
  ProfilePosts_Comments_Delete(params: {
    /**
     * Id of profile post comment.
     *
     * Sent as `comment_id`.
     */
    commentId: number;
  }): Promise<Response> {
    return this._request("DELETE", "/profile-posts/comments", {
      json: this._pick(params, {
        commentId: "comment_id",
      }),
    });
  }

  /**
   * Get Profile Post Comment
   *
   * Detail information of a profile post comment.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /profile-posts/{profile_post_id}/comments/{comment_id}`
   */
  ProfilePosts_Comments_Get(params: {
    /**
     * Id of profile post.
     *
     * Sent as `profile_post_id`.
     */
    profilePostId: number;
    /**
     * Id of profile post comment.
     *
     * Sent as `comment_id`.
     */
    commentId: number;
  }): Promise<Response> {
    return this._request("GET", `/profile-posts/${this._seg(params.profilePostId)}/comments/${this._seg(params.commentId)}`);
  }

  /**
   * Report a Profile Post Comment
   *
   * Report a profile post comment.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /profile-posts/comments/{comment_id}/report`
   */
  ProfilePosts_Comments_Report(params: {
    /**
     * Id of profile post comment.
     *
     * Sent as `comment_id`.
     */
    commentId: number;
    /** Reason of the report. */
    message: string;
  }): Promise<Response> {
    return this._request("POST", `/profile-posts/comments/${this._seg(params.commentId)}/report`, {
      json: this._pick(params, {
        message: "message",
      }),
    });
  }

  /**
   * Get Conversations
   *
   * List of conversations (with pagination).
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `GET /conversations`
   */
  Conversations_List(params: {
    /** Filter conversations by folder. */
    folder?: "all" | "unread" | "groups" | "market" | "market_replacements" | "staff" | "giveaways" | "p2p";
    /** Page number of conversations. */
    page?: number;
    /** Number of conversations in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/conversations", {
      params: this._pick(params, {
        folder: "folder",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Create Conversation
   *
   * Create a new conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `POST /conversations`
   */
  Conversations_Create(params: {
    /**
     * Id of recipient. Required if **is_group=false**.
     *
     * Sent as `recipient_id`.
     */
    recipientId?: number;
    /** List of recipients username's. Max recipients count is 10. Required if **is_group=true**. */
    recipients?: string[];
    /**
     * Is group. Set **false** if personal conversation, or set **true** if group.
     *
     * @defaultValue `false`
     *
     * Sent as `is_group`.
     */
    isGroup?: boolean;
    /** The title of new conversation. Required if **is_group=1**. */
    title?: string;
    /**
     * Open invite.
     *
     * Sent as `open_invite`.
     */
    openInvite?: boolean;
    /**
     * Allow edit messages.
     *
     * Sent as `allow_edit_messages`.
     */
    allowEditMessages?: boolean;
    /**
     * Allow members to stick messages.
     *
     * Sent as `allow_sticky_messages`.
     */
    allowStickyMessages?: boolean;
    /**
     * Allow members to delete their own messages.
     *
     * Sent as `allow_delete_own_messages`.
     */
    allowDeleteOwnMessages?: boolean;
    /**
     * First message. Required if **is_group**=false
     *
     * Sent as `message_body`.
     */
    messageBody?: string;
  } = {}): Promise<Response> {
    return this._request("POST", "/conversations", {
      json: this._pick(params, {
        recipientId: "recipient_id",
        recipients: "recipients",
        isGroup: "is_group",
        title: "title",
        openInvite: "open_invite",
        allowEditMessages: "allow_edit_messages",
        allowStickyMessages: "allow_sticky_messages",
        allowDeleteOwnMessages: "allow_delete_own_messages",
        messageBody: "message_body",
      }),
    });
  }

  /**
   * Edit Conversation
   *
   * Edit conversation.
   *
   * Required scopes:
   * + **conversate**
   *
   * `PUT /conversations`
   */
  Conversations_Update(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /** New conversation title. */
    title?: string;
    /**
     * Allow members to invite others.
     *
     * Sent as `open_invite`.
     */
    openInvite?: boolean;
    /**
     * Make conversation history visible to new members.
     *
     * Sent as `history_open`.
     */
    historyOpen?: boolean;
    /**
     * Allow members to edit their own messages.
     *
     * Sent as `allow_edit_messages`.
     */
    allowEditMessages?: boolean;
    /**
     * Allow members to stick messages.
     *
     * Sent as `allow_sticky_messages`.
     */
    allowStickyMessages?: boolean;
    /**
     * Allow members to delete their own messages.
     *
     * Sent as `allow_delete_own_messages`.
     */
    allowDeleteOwnMessages?: boolean;
  }): Promise<Response> {
    return this._request("PUT", "/conversations", {
      json: this._pick(params, {
        conversationId: "conversation_id",
        title: "title",
        openInvite: "open_invite",
        historyOpen: "history_open",
        allowEditMessages: "allow_edit_messages",
        allowStickyMessages: "allow_sticky_messages",
        allowDeleteOwnMessages: "allow_delete_own_messages",
      }),
    });
  }

  /**
   * Leave Conversation
   *
   * Leave the conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `DELETE /conversations`
   */
  Conversations_Delete(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Deletion type.
     *
     * Sent as `delete_type`.
     */
    deleteType: "delete" | "delete_ignore";
  }): Promise<Response> {
    return this._request("DELETE", "/conversations", {
      json: this._pick(params, {
        conversationId: "conversation_id",
        deleteType: "delete_type",
      }),
    });
  }

  /**
   * Start Conversation
   *
   * Start a new conversation with a user.
   *
   * Required scopes:
   * + **conversate**
   *
   * `POST /conversations/start`
   */
  Conversations_Start(params: {
    /** Sent as `user_id`. */
    userId: string | number;
  }): Promise<Response> {
    return this._request("POST", "/conversations/start", {
      json: this._pick(params, {
        userId: "user_id",
      }),
    });
  }

  /**
   * Send Content To Saved Messages
   *
   * Send content to Saved Messages.
   *
   * Required scopes:
   * + **conversate**
   *
   * `POST /conversations/save`
   */
  Conversations_Save(params: {
    /** Content url. */
    link: string;
  }): Promise<Response> {
    return this._request("POST", "/conversations/save", {
      json: this._pick(params, {
        link: "link",
      }),
    });
  }

  /**
   * Get Conversation
   *
   * Detail information of a conversation.
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `GET /conversations/{conversation_id}`
   */
  Conversations_Get(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("GET", `/conversations/${this._seg(params.conversationId)}`);
  }

  /**
   * Get Conversation Messages
   *
   * List of messages in a conversation (with pagination).
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `GET /conversations/{conversation_id}/messages`
   */
  Conversations_Messages_List(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /** Page number of messages. */
    page?: number;
    /** Number of messages in a page. */
    limit?: number;
    /** Ordering of messages. */
    order?: "natural" | "natural_reverse";
    /** Date to get older messages. */
    before?: number;
    /** Date to get newer messages. */
    after?: number;
  }): Promise<Response> {
    return this._request("GET", `/conversations/${this._seg(params.conversationId)}/messages`, {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
        order: "order",
        before: "before",
        after: "after",
      }),
    });
  }

  /**
   * Create Conversation Message
   *
   * Create a new conversation message.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/messages`
   */
  Conversations_Messages_Create(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Content of the new message.
     *
     * Sent as `message_body`.
     */
    messageBody: string;
    /**
     * ID of the message being replied to.
     *
     * Sent as `reply_message_id`.
     */
    replyMessageId?: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/messages`, {
      json: this._pick(params, {
        replyMessageId: "reply_message_id",
        messageBody: "message_body",
      }),
    });
  }

  /**
   * Search Conversations Messages
   *
   * Search for conversations messages or recipients.
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `POST /conversations/search`
   */
  Conversations_Search(params: {
    /** Search query string. */
    q?: string;
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId?: number;
    /**
     * Search for recipients.
     *
     * Sent as `search_recipients`.
     */
    searchRecipients?: boolean;
  } = {}): Promise<Response> {
    return this._request("POST", "/conversations/search", {
      json: this._pick(params, {
        q: "q",
        conversationId: "conversation_id",
        searchRecipients: "search_recipients",
      }),
    });
  }

  /**
   * Get Conversation Message
   *
   * Detail information of a message.
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `GET /conversations/messages/{message_id}`
   */
  Conversations_Messages_Get(params: {
    /**
     * Id of message.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("GET", `/conversations/messages/${this._seg(params.messageId)}`);
  }

  /**
   * Edit Conversation Message
   *
   * Edit a message.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `PUT /conversations/{conversation_id}/messages/{message_id}`
   */
  Conversations_Messages_Edit(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Id of message.
     *
     * Sent as `message_id`.
     */
    messageId: number;
    /**
     * New content of the message.
     *
     * Sent as `message_body`.
     */
    messageBody: string;
  }): Promise<Response> {
    return this._request("PUT", `/conversations/${this._seg(params.conversationId)}/messages/${this._seg(params.messageId)}`, {
      json: this._pick(params, {
        messageBody: "message_body",
      }),
    });
  }

  /**
   * Delete Conversation Message
   *
   * Deletes a message from a conversation.
   *
   * Required scopes:
   * + **conversate**
   *
   * `DELETE /conversations/{conversation_id}/messages/{message_id}`
   */
  Conversations_Messages_Delete(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Id of message.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/conversations/${this._seg(params.conversationId)}/messages/${this._seg(params.messageId)}`);
  }

  /**
   * Invite Users to Conversation
   *
   * Invite one or more users to an existing conversation.
   *
   * Required scopes:
   * + **conversate**
   * + **post**
   *
   * `POST /conversations/{conversation_id}/invite`
   */
  Conversations_Invite(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /** List of recipients username's. */
    recipients: string[];
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/invite`, {
      json: this._pick(params, {
        recipients: "recipients",
      }),
    });
  }

  /**
   * Kick User from Conversation
   *
   * Kicks a user from a conversation.
   *
   * Required scopes:
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/kick`
   */
  Conversations_Kick(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Id of user to kick from conversation.
     *
     * Sent as `user_id`.
     */
    userId: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/kick`, {
      json: this._pick(params, {
        userId: "user_id",
      }),
    });
  }

  /**
   * Read a Conversation
   *
   * Read a specific conversation.
   *
   * Required scopes:
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/read`
   */
  Conversations_Read(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/read`);
  }

  /**
   * Read All Conversations
   *
   * Mark all conversations as read.
   *
   * Required scopes:
   * + **read**
   * + **conversate**
   *
   * `POST /conversations/read-all`
   */
  Conversations_ReadAll(): Promise<Response> {
    return this._request("POST", "/conversations/read-all");
  }

  /**
   * Stick Conversation Message
   *
   * Stick a message in a conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/messages/{message_id}/stick`
   */
  Conversations_Messages_Stick(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Id of message.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/messages/${this._seg(params.messageId)}/stick`);
  }

  /**
   * Unstick Conversation Message
   *
   * Unstick a message in a conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `DELETE /conversations/{conversation_id}/messages/{message_id}/stick`
   */
  Conversations_Messages_Unstick(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
    /**
     * Id of message.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/conversations/${this._seg(params.conversationId)}/messages/${this._seg(params.messageId)}/stick`);
  }

  /**
   * Star Conversation
   *
   * Star conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/star`
   */
  Conversations_Star(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/star`);
  }

  /**
   * Unstar Conversation
   *
   * Unstar conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `DELETE /conversations/{conversation_id}/star`
   */
  Conversations_Unstar(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/conversations/${this._seg(params.conversationId)}/star`);
  }

  /**
   * Enable Conversation Alerts
   *
   * Enable alerts for conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `POST /conversations/{conversation_id}/alerts`
   */
  Conversations_Alerts_Enable(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("POST", `/conversations/${this._seg(params.conversationId)}/alerts`);
  }

  /**
   * Disable Conversation Alerts
   *
   * Disable alerts for conversation.
   *
   * Required scopes:
   * + **post**
   * + **conversate**
   *
   * `DELETE /conversations/{conversation_id}/alerts`
   */
  Conversations_Alerts_Disable(params: {
    /**
     * Id of conversation.
     *
     * Sent as `conversation_id`.
     */
    conversationId: number;
  }): Promise<Response> {
    return this._request("DELETE", `/conversations/${this._seg(params.conversationId)}/alerts`);
  }

  /**
   * Get Notifications
   *
   * List of notifications (both read and unread).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /notifications`
   */
  Notifications_List(params: {
    /**
     * Filter notifications by their type.
     *
     * Sent as `type`.
     */
    type_?: "market" | "nomarket";
    /** Page number of notifications. */
    page?: number;
    /** Number of notifications in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/notifications", {
      params: this._pick(params, {
        type_: "type",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get Notification
   *
   * Get associated content of notification. The response depends on the content type.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /notifications/{notification_id}/content`
   */
  Notifications_Get(params: {
    /**
     * Id of notification.
     *
     * Sent as `notification_id`.
     */
    notificationId: number;
  }): Promise<Response> {
    return this._request("GET", `/notifications/${this._seg(params.notificationId)}/content`);
  }

  /**
   * Mark Notification Read
   *
   * Mark single notification or all existing notifications read.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /notifications/read`
   */
  Notifications_Read(params: {
    /**
     * If notification_id is omitted, it's mark all existing notifications as read.
     *
     * Sent as `notification_id`.
     */
    notificationId?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/notifications/read", {
      json: this._pick(params, {
        notificationId: "notification_id",
      }),
    });
  }

  /**
   * Get Popular Tags
   *
   * List of popular tags (no pagination).
   *
   * Required scopes:
   * + **read**
   *
   * `GET /tags`
   */
  Tags_Popular(): Promise<Response> {
    return this._request("GET", "/tags");
  }

  /**
   * Get Tags
   *
   * List of tags.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /tags/list`
   */
  Tags_List(params: {
    /** Page number of tags list. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/tags/list", {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get Tagged Content
   *
   * List of tagged contents.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /tags/{tag_id}`
   */
  Tags_Get(params: {
    /**
     * Id of tag.
     *
     * Sent as `tag_id`.
     */
    tagId: number;
    /** Page number of tagged contents. */
    page?: number;
    /** Number of tagged contents in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/tags/${this._seg(params.tagId)}`, {
      params: this._pick(params, {
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get Filtered Content
   *
   * Filtered list of tags.
   *
   * Required scopes:
   * + **read**
   *
   * `GET /tags/find`
   */
  Tags_Find(params: {
    /** tag to filter. Tags start with the query will be returned. */
    tag: string;
  }): Promise<Response> {
    return this._request("GET", "/tags/find", {
      params: this._pick(params, {
        tag: "tag",
      }),
    });
  }

  /**
   * Search
   *
   * Search for all supported contents.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search`
   */
  Search_All(params: {
    /** Search query. Can be skipped if **user_id** is set. */
    q?: string;
    /** Tag to search for tagged contents. */
    tag?: string;
    /**
     * Id of the container forum to search for contents. Child forums of the specified forum will be included in the search.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /** Sent as `user_id`. */
    userId?: string | number;
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/search", {
      json: this._pick(params, {
        q: "q",
        tag: "tag",
        forumId: "forum_id",
        userId: "user_id",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Search Thread
   *
   * Search for threads.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search/threads`
   */
  Search_Threads(params: {
    /** Search query. Can be skipped if **user_id** is set. */
    q?: string;
    /** Tag to search for tagged contents. */
    tag?: string;
    /**
     * Id of the container forum to search for contents. Child forums of the specified forum will be included in the search.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /** Sent as `user_id`. */
    userId?: string | number;
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
    /**
     * Number of thread data to be returned.
     *
     * Sent as `data_limit`.
     */
    dataLimit?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/search/threads", {
      json: this._pick(params, {
        q: "q",
        tag: "tag",
        forumId: "forum_id",
        userId: "user_id",
        page: "page",
        limit: "limit",
        dataLimit: "data_limit",
      }),
    });
  }

  /**
   * Search Post
   *
   * Search for posts.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search/posts`
   */
  Search_Posts(params: {
    /** Search query. Can be skipped if **user_id** is set. */
    q?: string;
    /** Tag to search for tagged contents. */
    tag?: string;
    /**
     * Id of the container forum to search for contents. Child forums of the specified forum will be included in the search.
     *
     * Sent as `forum_id`.
     */
    forumId?: number;
    /** Sent as `user_id`. */
    userId?: string | number;
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
    /**
     * Number of post data to be returned.
     *
     * Sent as `data_limit`.
     */
    dataLimit?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/search/posts", {
      json: this._pick(params, {
        q: "q",
        tag: "tag",
        forumId: "forum_id",
        userId: "user_id",
        page: "page",
        limit: "limit",
        dataLimit: "data_limit",
      }),
    });
  }

  /**
   * Search Users
   *
   * Search for users.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search/users`
   */
  Search_Users(params: {
    /** Search query. */
    q?: string;
  } = {}): Promise<Response> {
    return this._request("POST", "/search/users", {
      json: this._pick(params, {
        q: "q",
      }),
    });
  }

  /**
   * Search Profile Posts
   *
   * Search for profile posts.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search/profile-posts`
   */
  Search_ProfilePosts(params: {
    /** Search query. Can be skipped if **user_id** is set. */
    q?: string;
    /**
     * User ID to filter profile posts.
     *
     * Sent as `user_id`.
     */
    userId?: number;
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/search/profile-posts", {
      json: this._pick(params, {
        q: "q",
        userId: "user_id",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Search Tagged
   *
   * Search for tagged contents.
   *
   * Required scopes:
   * + **post**
   *
   * `POST /search/tagged`
   */
  Search_Tagged(params: {
    /** Tag to search for tagged contents. */
    tag?: string;
    /** Array of tags to search for tagged contents. */
    tags?: string[];
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
  } = {}): Promise<Response> {
    return this._request("POST", "/search/tagged", {
      json: this._pick(params, {
        tag: "tag",
        tags: "tags",
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Get Search Results
   *
   * List of search results (with pagination).
   *
   * Required scopes:
   * + **get**
   *
   * `GET /search/{search_id}/results`
   */
  Search_Results(params: {
    /**
     * Search ID.
     *
     * Sent as `search_id`.
     */
    searchId: string | number;
    /** Page number of results. */
    page?: number;
    /** Number of results in a page. */
    limit?: number;
  }): Promise<Response> {
    return this._request("GET", `/search/${this._seg(params.searchId)}/results`, {
      json: this._pick(params, {
        page: "page",
        limit: "limit",
      }),
    });
  }

  /**
   * Batch
   *
   * Execute multiple API requests at once (Separated by comma). Maximum batch jobs is 10.
   *
   * Required scopes:
   * + Same as called API requests.
   *
   * `POST /batch`
   */
  Batch_Execute(): Promise<Response> {
    return this._request("POST", "/batch");
  }

  /**
   * Get Chats
   *
   * Get chat rooms.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox`
   */
  Chatbox_Index(params: {
    /**
     * Room id.
     *
     * - `1`: [Russian] General chat
     * - `2`: [English] General hat
     * - `3`: [Russian] Market chat
     * - `4`: [English] Market chat
     * - `13`: No whiners chat
     *
     * Sent as `room_id`.
     */
    roomId?: 1 | 2 | 3 | 4 | 13;
  } = {}): Promise<Response> {
    return this._request("GET", "/chatbox", {
      params: this._pick(params, {
        roomId: "room_id",
      }),
    });
  }

  /**
   * Get Chat Messages
   *
   * Get chat messages.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox/messages`
   */
  Chatbox_GetMessages(params: {
    /**
     * Room id.
     *
     * - `1`: [Russian] General chat
     * - `2`: [English] General hat
     * - `3`: [Russian] Market chat
     * - `4`: [English] Market chat
     * - `13`: No whiners chat
     *
     * Sent as `room_id`.
     */
    roomId: 1 | 2 | 3 | 4 | 13;
    /**
     * Message id to get older chat messages.
     *
     * Sent as `before_message_id`.
     */
    beforeMessageId?: number;
  }): Promise<Response> {
    return this._request("GET", "/chatbox/messages", {
      params: this._pick(params, {
        roomId: "room_id",
        beforeMessageId: "before_message_id",
      }),
    });
  }

  /**
   * Create Chat Message
   *
   * Create chat message.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `POST /chatbox/messages`
   */
  Chatbox_PostMessage(params: {
    /**
     * - `1`: [Russian] General chat
     * - `2`: [English] General hat
     * - `3`: [Russian] Market chat
     * - `4`: [English] Market chat
     * - `13`: No whiners chat
     *
     * Sent as `room_id`.
     */
    roomId: 1 | 2 | 3 | 4 | 13;
    /** Content of the chat message. */
    message: string;
    /**
     * ID of the message being replied to.
     *
     * Sent as `reply_message_id`.
     */
    replyMessageId?: number;
  }): Promise<Response> {
    return this._request("POST", "/chatbox/messages", {
      json: this._pick(params, {
        roomId: "room_id",
        replyMessageId: "reply_message_id",
        message: "message",
      }),
    });
  }

  /**
   * Edit Chat Message
   *
   * Edit chat message.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `PUT /chatbox/messages`
   */
  Chatbox_EditMessage(params: {
    /**
     * Message id.
     *
     * Sent as `message_id`.
     */
    messageId: number;
    /** New content of the chat message. */
    message: string;
  }): Promise<Response> {
    return this._request("PUT", "/chatbox/messages", {
      json: this._pick(params, {
        messageId: "message_id",
        message: "message",
      }),
    });
  }

  /**
   * Delete Chat Message
   *
   * Delete chat message.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `DELETE /chatbox/messages`
   */
  Chatbox_DeleteMessage(params: {
    /**
     * Message id.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("DELETE", "/chatbox/messages", {
      json: this._pick(params, {
        messageId: "message_id",
      }),
    });
  }

  /**
   * Get Chat Online
   *
   * Get chat Online Users.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox/messages/online`
   */
  Chatbox_Online(params: {
    /**
     * Room id.
     *
     * - `1`: [Russian] General chat
     * - `2`: [English] General hat
     * - `3`: [Russian] Market chat
     * - `4`: [English] Market chat
     * - `13`: No whiners chat
     *
     * Sent as `room_id`.
     */
    roomId: 1 | 2 | 3 | 4 | 13;
  }): Promise<Response> {
    return this._request("GET", "/chatbox/messages/online", {
      params: this._pick(params, {
        roomId: "room_id",
      }),
    });
  }

  /**
   * Get Chat Message Report Reasons
   *
   * Report chat message.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox/messages/report`
   */
  Chatbox_ReportReasons(params: {
    /**
     * Message id.
     *
     * Sent as `message_id`.
     */
    messageId: number;
  }): Promise<Response> {
    return this._request("GET", "/chatbox/messages/report", {
      params: this._pick(params, {
        messageId: "message_id",
      }),
    });
  }

  /**
   * Report Chat Message
   *
   * Report chat message.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `POST /chatbox/messages/report`
   */
  Chatbox_Report(params: {
    /**
     * Message id.
     *
     * Sent as `message_id`.
     */
    messageId: number;
    /** Report reason. */
    reason: string;
  }): Promise<Response> {
    return this._request("POST", "/chatbox/messages/report", {
      json: this._pick(params, {
        messageId: "message_id",
        reason: "reason",
      }),
    });
  }

  /**
   * Get Chat Leaderboard
   *
   * Get chat leaderboard.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox/messages/leaderboard`
   */
  Chatbox_GetLeaderboard(params: {
    /** Duration. */
    duration?: "day" | "week" | "month";
  } = {}): Promise<Response> {
    return this._request("GET", "/chatbox/messages/leaderboard", {
      params: this._pick(params, {
        duration: "duration",
      }),
    });
  }

  /**
   * Get Ignored Chat Users
   *
   * Get list of ignored chat users.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `GET /chatbox/ignore`
   */
  Chatbox_GetIgnore(): Promise<Response> {
    return this._request("GET", "/chatbox/ignore");
  }

  /**
   * Ignore Chat User
   *
   * Ignore chat user.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `POST /chatbox/ignore`
   */
  Chatbox_PostIgnore(params: {
    /** Sent as `user_id`. */
    userId: string | number;
  }): Promise<Response> {
    return this._request("POST", "/chatbox/ignore", {
      json: this._pick(params, {
        userId: "user_id",
      }),
    });
  }

  /**
   * Unignore Chat User
   *
   * Unignore chat user.
   *
   * Required scopes:
   * + **chatbox**
   *
   * `DELETE /chatbox/ignore`
   */
  Chatbox_DeleteIgnore(params: {
    /** Sent as `user_id`. */
    userId: string | number;
  }): Promise<Response> {
    return this._request("DELETE", "/chatbox/ignore", {
      json: this._pick(params, {
        userId: "user_id",
      }),
    });
  }

  /**
   * Get Forms List
   *
   * `GET /forms`
   */
  Forms_List(params: {
    /** Page number of forms. */
    page?: number;
  } = {}): Promise<Response> {
    return this._request("GET", "/forms", {
      params: this._pick(params, {
        page: "page",
      }),
    });
  }

  /**
   * Create Form
   *
   * Create Form.
   *
   * `POST /forms/save`
   */
  Forms_Create(params: {
    /**
     * Form ID
     *
     * Sent as `form_id`.
     */
    formId: 1 | 3;
    fields: Record<string, unknown>;
  }): Promise<Response> {
    return this._request("POST", "/forms/save", {
      json: this._pick(params, {
        formId: "form_id",
        fields: "fields",
      }),
    });
  }
}
