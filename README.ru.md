# lolzteam-api-ts

TypeScript и JavaScript SDK для API **LOLZTEAM Forum** и **Market**, сгенерированный из официальных OpenAPI документов.

[English version](README.md)

[![npm](https://img.shields.io/npm/v/lolzteam-api-ts.svg)](https://www.npmjs.com/package/lolzteam-api-ts)
[![license](https://img.shields.io/npm/l/lolzteam-api-ts.svg)](LICENSE)
[![types](https://img.shields.io/badge/types-included-blue.svg)](https://www.typescriptlang.org/)

---

## Содержание

- [Возможности](#возможности)
- [Требования](#требования)
- [Установка](#установка)
- [Быстрый старт](#быстрый-старт)
- [Как устроены имена методов и параметров](#как-устроены-имена-методов-и-параметров)
- [Опции клиента](#опции-клиента)
- [Изменение настроек во время работы](#изменение-настроек-во-время-работы)
- [Работа с ответами](#работа-с-ответами)
- [Обработка ошибок](#обработка-ошибок)
- [Повторные попытки и лимиты](#повторные-попытки-и-лимиты)
- [Таймауты и отмена запросов](#таймауты-и-отмена-запросов)
- [Загрузка файлов](#загрузка-файлов)
- [Прокси](#прокси)
- [Сырые запросы](#сырые-запросы)
- [Использование в браузере](#использование-в-браузере)
- [Полный справочник API](#полный-справочник-api)
- [Перегенерация из OpenAPI документов](#перегенерация-из-openapi-документов)
- [Разработка](#разработка)
- [Публикация в npm](#публикация-в-npm)
- [Структура проекта](#структура-проекта)
- [Лицензия](#лицензия)

---

## Возможности

- **Полное покрытие.** 151 метод Forum и 115 методов Market, сгенерированных напрямую из официальных документов OpenAPI 3.1.
- **Корректная передача данных.** Вы пишете `parentCategoryId`, а SDK отправляет `parent_category_id`. Параметры-массивы со скобками вида `prefix_ids[]` и параметры, объединяемые через запятую, вроде `fields_include`, обрабатываются автоматически.
- **Полная типизация.** Перечисления превращаются в литеральные объединения, каждый параметр снабжён документацией, автодополнение в редакторе работает сразу.
- **Ноль зависимостей во время выполнения.** В основе лежит глобальный `fetch`, поэтому пакет работает в Node.js 18+, Deno, Bun, Cloudflare Workers и современных браузерах.
- **Двойная сборка.** Поставляются CommonJS, ES modules и файлы деклараций типов.
- **Готовый к продакшену транспорт.** Автоматические повторы с экспоненциальной задержкой и поддержкой `Retry-After`, ограничение частоты запросов, таймауты, отмена и поддержка прокси.

## Требования

| Среда выполнения | Версия |
| --- | --- |
| Node.js | 18.0.0 или новее (глобальный `fetch`) |
| TypeScript | 4.7 или новее (не обязателен) |
| Браузеры | Любой браузер с `fetch` и `AbortController` |

В более старых средах передайте свою реализацию `fetch` через опцию клиента `fetch`.

## Установка

```bash
npm install lolzteam-api-ts
```

```bash
yarn add lolzteam-api-ts
```

```bash
pnpm add lolzteam-api-ts
```

Для работы через HTTP прокси нужна дополнительная опциональная зависимость:

```bash
npm install undici
```

## Быстрый старт

```typescript
import { Forum, Market } from "lolzteam-api-ts";

const token = process.env.LOLZ_TOKEN!;

const forum = new Forum({ token });
const market = new Market({ token });

// Forum: получить собственный профиль.
const profileResponse = await forum.me();
const profile = await profileResponse.json();
console.log(profile.user.username);

// Forum: список тем в разделе.
const threadsResponse = await forum.Threads_List({ forumId: 876, limit: 10 });
const { threads } = await threadsResponse.json();

// Forum: создать сообщение.
await forum.Posts_Create({ threadId: 123456, postBody: "Привет из TypeScript" });

// Market: получить лот.
const itemResponse = await market.Managing_Get({ itemId: 12345678 });
const { item } = await itemResponse.json();

// Market: поиск аккаунтов Steam.
const steamResponse = await market.Category_Steam({ pmin: 100, pmax: 500, origin__: ["brute"] });
const { items } = await steamResponse.json();
```

CommonJS работает точно так же:

```javascript
const { Forum, Market } = require("lolzteam-api-ts");

const forum = new Forum({ token: process.env.LOLZ_TOKEN });
```

## Как устроены имена методов и параметров

API LOLZTEAM использует snake_case, а часть параметров записывается как массивы со скобками. Писать это вручную легко с ошибками, поэтому SDK предоставляет привычные имена в camelCase и преобразует их обратно перед отправкой запроса.

| Вы пишете | SDK отправляет |
| --- | --- |
| `parentCategoryId: 7` | `parent_category_id=7` |
| `postBody: "Привет"` | `{"post_body": "Привет"}` |
| `prefixIds__: [1, 2]` | `prefix_ids[]=1&prefix_ids[]=2` |
| `fieldsInclude: ["a", "b"]` | `fields_include=a,b` |
| `type_: "money_transfer"` | `type=money_transfer` |

Правила именования:

- **Имена методов** берутся из `operationId` в OpenAPI документе, точки заменяются подчёркиваниями. `Users.Get` становится `Users_Get`, `Threads.Poll.Vote` становится `Threads_Poll_Vote`.
- **Имена параметров** это camelCase форма имени, используемого на стороне API. Каждый переименованный параметр сообщает об этом в своём комментарии, например "Sent as `parent_category_id`".
- Параметры, совпадающие с ключевыми словами TypeScript, получают подчёркивание в конце: `type` становится `type_`.
- Параметры со скобками получают в TypeScript окончание `__`, потому что символы `[` и `]` недопустимы в идентификаторах: `origin[]` становится `origin__`.
- Параметры пути подставляются в URL и никогда не попадают ни в строку запроса, ни в тело запроса.

При наведении курсора на метод редактор показывает краткое описание, HTTP маршрут и документацию по каждому параметру, включая значения перечислений.

## Опции клиента

`Forum` и `Market` принимают одинаковый набор опций.

```typescript
const forum = new Forum({
  token: "ВАШ_ТОКЕН",
  language: "ru",
  baseUrl: "https://prod-api.lolz.live",
  timeoutMs: 30_000,
  delayMs: 500,
  maxRetries: 5,
  retryStatuses: [429, 500, 502, 503, 504],
  userAgent: "my-app/1.0.0",
  proxy: "http://user:pass@127.0.0.1:8080",
  warnOnRetry: true,
});
```

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `token` | `string` | обязательно | Bearer токен для заголовка `Authorization`. |
| `language` | `string` | `"en"` | Значение заголовка `Accept-Language`. Укажите `"ru"` для ответов на русском. |
| `baseUrl` | `string` | см. ниже | Переопределяет хост API. Полезно для зеркал. |
| `timeoutMs` | `number` | `30000` | Таймаут на одну попытку. |
| `delayMs` | `number` | `500` | Минимальная пауза между двумя последовательными запросами одного клиента. |
| `maxRetries` | `number` | `5` | Общее число попыток для повторяемых статусов. |
| `retryStatuses` | `number[]` | `[429, 500, 502, 503, 504]` | Статусы, вызывающие повтор запроса. |
| `userAgent` | `string` | `lolzteam-api-ts/<версия>` | Значение заголовка `User-Agent`. Браузеры его игнорируют. |
| `proxy` | `string` | нет | URL HTTP или HTTPS прокси. Только Node.js, требуется `undici`. |
| `dispatcher` | `unknown` | нет | Готовый диспетчер undici. Имеет приоритет над `proxy`. |
| `fetch` | `FetchLike` | глобальный `fetch` | Своя реализация транспорта. |
| `warnOnRetry` | `boolean` | `true` | Выводить предупреждение перед каждым повтором. |

Хосты по умолчанию и их зеркала экспортируются как константы:

```typescript
import { FORUM_BASE_URL, FORUM_MIRRORS, MARKET_BASE_URL, MARKET_MIRRORS } from "lolzteam-api-ts";

FORUM_BASE_URL;  // "https://prod-api.lolz.live"
FORUM_MIRRORS;   // prod-api.lolz.live, prod-api.zelenka.guru, api.lolz.live, api.zelenka.guru
MARKET_BASE_URL; // "https://prod-api.lzt.market"
MARKET_MIRRORS;  // prod-api.lzt.market, api.lzt.market
```

## Изменение настроек во время работы

Токен, язык, прокси и базовый URL это обычные свойства, поэтому их можно менять без создания нового клиента.

```typescript
const forum = new Forum({ token: "первый-токен" });

forum.token = "второй-токен";
forum.language = "ru";
forum.proxy = "http://127.0.0.1:8080";
forum.baseUrl = "https://api.zelenka.guru";

forum.proxy = undefined; // обратно к прямому соединению
```

Базовый транспорт доступен как `forum.http`, если он вам понадобится.

## Работа с ответами

Каждый метод возвращает стандартный объект `Response`, в том числе для статусов 4xx и 5xx. Ничего не разворачивается и не перестраивается, полный контроль остаётся у вас.

```typescript
const response = await forum.Users_Get({ userId: 2410024 });

if (!response.ok) {
  const problem = await response.json();
  console.error(response.status, problem);
} else {
  const { user } = await response.json();
  console.log(user.username, user.user_id);
}
```

Если нужны типизированные данные, опишите их в месте вызова:

```typescript
interface UserPayload {
  user: { user_id: number; username: string; user_message_count: number };
}

const { user } = (await (await forum.Users_Get({ userId: 2410024 })).json()) as UserPayload;
```

Заголовки лимитов доступны как обычно:

```typescript
const remaining = response.headers.get("X-Ratelimit-Remaining");
```

## Обработка ошибок

HTTP статусы никогда не превращаются в исключения. Выбрасываются только сбои транспорта, и у каждого есть свой класс.

```typescript
import {
  LolzteamError,
  LolzteamAbortError,
  LolzteamNetworkError,
  LolzteamTimeoutError,
} from "lolzteam-api-ts";

try {
  await forum.Threads_List({ forumId: 876 });
} catch (error) {
  if (error instanceof LolzteamTimeoutError) {
    console.error(`Таймаут после ${error.timeoutMs} мс`);
  } else if (error instanceof LolzteamAbortError) {
    console.error("Отменено вызывающим кодом");
  } else if (error instanceof LolzteamNetworkError) {
    console.error("Сетевой сбой", error.cause);
  } else if (error instanceof LolzteamError) {
    console.error("Проблема конфигурации", error.message);
  } else {
    throw error;
  }
}
```

`LolzteamError` это базовый класс, поэтому одна проверка `instanceof LolzteamError` перехватывает все варианты.

## Повторные попытки и лимиты

Транспорт автоматически повторяет запрос при статусах `429`, `500`, `502`, `503` и `504`.

- Если в ответе есть заголовок `Retry-After`, в секундах или в виде даты HTTP, используется это значение.
- Иначе задержка растёт экспоненциально со случайным разбросом, начинается с 500 мс и ограничена 30 секундами.
- После `maxRetries` попыток последний ответ возвращается как есть, чтобы вы могли сами проверить статус.

Отдельно опция `delayMs` задаёт минимальный интервал между последовательными запросами одного экземпляра клиента. Значение по умолчанию в 500 мс уверенно укладывается в опубликованные лимиты. Параллельно отправленные запросы выстраиваются в очередь, а не уходят одновременно.

```typescript
// Быстрый режим для заведомо дешёвых эндпоинтов.
const fast = new Forum({ token, delayMs: 100 });

// Осторожный режим для эндпоинтов с жёсткими лимитами.
const slow = new Market({ token, delayMs: 3000, maxRetries: 8 });
```

## Таймауты и отмена запросов

```typescript
// Для всего клиента.
const forum = new Forum({ token, timeoutMs: 10_000 });

// Для отдельного запроса, через сырой помощник.
const controller = new AbortController();
setTimeout(() => controller.abort(), 2000);

await forum.request("GET", "/threads", {
  params: { forum_id: 876 },
  signal: controller.signal,
  timeoutMs: 5000,
});
```

Сгенерированные методы принимают один объект `params`. Когда нужен сигнал отмены или таймаут для конкретного запроса, используйте `request()`, как показано выше.

## Загрузка файлов

Эндпоинты, объявленные как `multipart/form-data`, принимают бинарные значения напрямую. Подойдут `Blob`, `ArrayBuffer`, типизированный массив или строка.

```typescript
import { readFile } from "node:fs/promises";

const avatar = await readFile("./avatar.png");

await forum.Users_Avatar_Upload({
  userId: 2410024,
  avatar: new Blob([avatar], { type: "image/png" }),
  crop: 256,
});
```

В браузере можно передать `File` прямо из элемента `<input type="file">`.

## Прокси

Глобальный `fetch` не принимает опцию прокси, поэтому поддержка прокси реализована через диспетчер undici.

```bash
npm install undici
```

```typescript
const forum = new Forum({
  token,
  proxy: "http://username:password@127.0.0.1:8080",
});
```

SOCKS прокси не поддерживаются классом `ProxyAgent` из undici. Передайте собственный диспетчер:

```typescript
import { socksDispatcher } from "fetch-socks";

const forum = new Forum({
  token,
  dispatcher: socksDispatcher({ type: 5, host: "127.0.0.1", port: 1080 }),
});
```

Любой свой транспорт тоже подойдёт:

```typescript
const forum = new Forum({
  token,
  fetch: (url, init) => myInstrumentedFetch(url, init),
});
```

## Сырые запросы

Используйте `request()`, когда эндпоинта нет в поставляемых документах или когда нужно самому управлять форматом передачи. Имена параметров передаются без изменений.

```typescript
const response = await forum.request("GET", "/users/me");

await forum.request("POST", "/posts", {
  json: { thread_id: 123456, post_body: "Сырое тело запроса" },
});

await market.request("GET", "/steam", {
  params: { pmin: 100, "origin[]": ["brute", "stealer"] },
});
```

`RequestOptions` принимает `params`, `json`, `data` (urlencoded), `form` (multipart), `headers`, `signal` и `timeoutMs`.

## Использование в браузере

Пакет работает в браузере без полифилов. Учтите, что API LOLZTEAM не отдаёт разрешающие заголовки CORS, поэтому для браузерных вызовов обычно нужен собственный прокси, а токен в клиентском коде становится общедоступным.

```html
<script type="module">
  import { Market } from "https://esm.sh/lolzteam-api-ts";

  const market = new Market({ token: "ВАШ_ТОКЕН", baseUrl: "/api/market-proxy" });
  const response = await market.Profile_Get();
  console.log(await response.json());
</script>
```

## Полный справочник API

Все сгенерированные методы с маршрутами и описаниями:

- [Справочник Forum API](docs/api-forum.md), 151 метод
- [Справочник Market API](docs/api-market.md), 115 методов

Оба файла создаются командой `npm run docs` из сгенерированных исходников, поэтому они не расходятся с кодом.

## Перегенерация из OpenAPI документов

Поставляемые документы лежат в `codegen/schemas/`. Обновляйте их и пересобирайте клиентов при изменениях API.

```bash
curl -fsSL "https://raw.githubusercontent.com/AS7RIDENIED/LOLZTEAM/main/Official%20Documentation/forum.json" -o codegen/schemas/forum.json
```

```bash
curl -fsSL "https://raw.githubusercontent.com/AS7RIDENIED/LOLZTEAM/main/Official%20Documentation/market.json" -o codegen/schemas/market.json
```

```bash
npm run codegen && npm run docs
```

Запуск генератора напрямую:

```bash
npx ts-node codegen/generate.ts --schema codegen/schemas/forum.json --output src/forum/_generated.ts --class ForumAPI
```

Генератор обрабатывает параметры пути, строки запроса и тела, разрешает `$ref`, объединяет тела `oneOf` и `anyOf`, превращает перечисления в литеральные объединения, поддерживает бинарные загрузки и учитывает флаг `explode`, который выбирает между повторением ключей и объединением через запятую. Тест `tests/codegen.test.ts` падает, если файлы в репозитории перестали совпадать с выводом генератора, так что расхождение сразу заметно в CI.

## Разработка

```bash
npm install
```

```bash
npm run verify
```

Команда `verify` последовательно запускает линтер, проверку типов, тесты и полную сборку. Отдельные шаги:

| Команда | Назначение |
| --- | --- |
| `npm run lint` | ESLint по исходникам, тестам, скриптам и генератору. |
| `npm run typecheck` | Проверка типов без генерации файлов. |
| `npm test` | Набор тестов Jest, 99 тестов. |
| `npm run test:coverage` | То же самое с отчётом о покрытии. |
| `npm run build` | Очистка и сборка CommonJS, ES modules и деклараций. |
| `npm run codegen` | Перегенерация обоих модулей API. |
| `npm run docs` | Перегенерация справочника методов. |
| `npm run sync-version` | Перезапись `src/version.ts` из `package.json`. |
| `npm run clean` | Удаление `dist/` и `coverage/`. |

## Публикация в npm

Имя пакета: `lolzteam-api-ts`.

### Перед первым релизом

1. Замените заглушку `USERNAME` в `package.json` на свой аккаунт GitHub в полях `homepage`, `repository.url` и `bugs.url`.
2. Убедитесь, что имя свободно, командой `npm view lolzteam-api-ts`. Ответ `404` означает, что имя доступно.
3. Обновите `LICENSE`, указав нужного правообладателя.

### Ручная публикация

npm требует двухфакторную аутентификацию для публикации. Сначала включите её на <https://www.npmjs.com/settings/~/profile> в разделе Two-Factor Authentication, режим **Authorization and writes**. Стоит подключить и приложение-аутентификатор, и security key: код для командной строки даёт только приложение.

```bash
npm login
```

```bash
npm run verify
```

```bash
npm publish --access public --otp=123456
```

Подставьте текущий код из приложения-аутентификатора. Если вы подключили только security key, кода нет: уберите `--otp` и подтвердите операцию в окне браузера, которое откроет npm.

Хук `prepublishOnly` сам запускает `npm run verify`, поэтому сломанная сборка не попадёт в реестр. Заранее посмотреть точное содержимое архива можно так:

```bash
npm pack --dry-run
```

### Выпуск новой версии

```bash
npm version patch
```

`npm version` принимает `patch`, `minor` и `major` и создаёт git тег. Скрипт жизненного цикла `version` перегенерирует `src/version.ts` из `package.json` и добавит его в коммит, поэтому экспортируемая константа `VERSION` не расходится с манифестом. Тест `tests/package.test.ts` упадёт, если это всё же случится. Затем отправьте изменения:

```bash
git push --follow-tags
```

```bash
npm publish --access public
```

### Автоматическая публикация через GitHub Actions

Файл `.github/workflows/publish.yml` публикует пакет при отправке тега вида `v1.2.3`. Используется **trusted publishing** поверх OIDC, поэтому никакой токен npm в репозитории не хранится.

Долгоживущие granular access tokens с опцией обхода 2FA выводятся из обращения: в начале августа 2026 они теряют доступ к чувствительным операциям аккаунта, а примерно в январе 2027 лишаются права публикации напрямую. Trusted publishing это их замена.

Trusted publishing настраивается только для уже существующего пакета, поэтому самую первую версию придётся выложить вручную, как описано выше. После этого:

1. Откройте `https://www.npmjs.com/package/lolzteam-api-ts/access`.
2. В разделе **Trusted Publisher** выберите **GitHub Actions**.
3. Заполните поля:
   - **Organization or user**: ваш аккаунт GitHub
   - **Repository**: `lolzteam-api-ts`
   - **Workflow filename**: `publish.yml`, только имя файла, без пути
   - **Environment name**: оставьте пустым, если не добавляли environment в workflow
4. В **Allowed actions** отметьте `npm publish`.
5. Создайте и отправьте тег:

```bash
git tag v1.0.0 && git push origin v1.0.0
```

Workflow запускает линтер, проверку типов и тесты на Node 18, 20 и 22, затем собирает и публикует пакет вместе с provenance.

Требования, которые workflow уже выполняет, перечислены здесь потому, что их легко случайно сломать:

- `permissions: id-token: write` у задачи публикации, именно это выдаёт OIDC токен.
- npm 11.5.1 или новее и Node 22.14.0 или новее. Node 22 всё ещё поставляется с npm 10, поэтому workflow ставит `npm@11` перед публикацией. Мажорная версия закреплена намеренно: `npm@latest` это уже npm 12, чей диапазон engines исключает старые патч-версии Node 22.
- Отсутствие `registry-url` у `actions/setup-node`. Иначе создаётся `.npmrc` с пустым токеном авторизации, что конфликтует с OIDC.
- Поле `repository.url` в `package.json` должно точно совпадать с репозиторием на GitHub.

### Зеркало в GitHub Packages

Тот же workflow публикует копию в реестр GitHub, и именно она заполняет панель **Packages** на странице репозитория. Этот реестр принимает только имена со scope владельца репозитория, поэтому зеркало называется `@liwidale/lolzteam-api-ts`. Переименование происходит только в CI и никогда не коммитится, имя на npmjs.com остаётся `lolzteam-api-ts`.

Настраивать ничего не нужно: задача авторизуется автоматическим `GITHUB_TOKEN` с правом `packages: write`, никаких секретов в репозитории не хранится.

Установка из npm, это основной источник:

```bash
npm install lolzteam-api-ts
```

Установка зеркала, для неё нужен токен GitHub с правом `read:packages`, потому что реестр GitHub требует авторизацию на любое чтение, включая публичное:

```bash
npm install @liwidale/lolzteam-api-ts --registry=https://npm.pkg.github.com
```

### Публикация в области видимости

Если свободного имени без области нет, переключитесь на имя со scope:

```bash
npm pkg set name=@your-scope/lolzteam-api-ts
```

Пакеты со scope по умолчанию приватные, поэтому во всех командах публикации выше указан флаг `--access public`.

## Структура проекта

```
lolzteam-api-ts/
├── .github/workflows/
│   ├── ci.yml                  Линтер, типы, тесты и сборка на каждый push
│   └── publish.yml             Публикация в npm по тегу версии
├── codegen/
│   ├── generate.ts             Генератор OpenAPI в TypeScript
│   └── schemas/
│       ├── forum.json          Официальный OpenAPI документ Forum
│       └── market.json         Официальный OpenAPI документ Market
├── docs/
│   ├── api-forum.md            Сгенерированный справочник методов Forum
│   └── api-market.md           Сгенерированный справочник методов Market
├── scripts/
│   ├── api-reference.mjs       Создаёт файлы в docs/
│   ├── clean.mjs               Удаляет результаты сборки
│   └── postbuild.mjs           Завершает и проверяет двойную сборку пакета
├── src/
│   ├── core/
│   │   ├── base.ts             BaseClient: настройки, сырые запросы, маппинг имён
│   │   ├── client.ts           HTTP транспорт: повторы, лимиты, таймауты
│   │   ├── errors.ts           Иерархия ошибок
│   │   └── index.ts            Экспорты ядра
│   ├── forum/
│   │   ├── _generated.ts       151 сгенерированный метод Forum
│   │   └── index.ts            Клиент Forum
│   ├── market/
│   │   ├── _generated.ts       115 сгенерированных методов Market
│   │   └── index.ts            Клиент Market
│   ├── index.ts                Точка входа пакета
│   └── version.ts              Константа версии
├── tests/
│   ├── client.test.ts          Поведение транспорта
│   ├── codegen.test.ts         Вывод генератора и его актуальность
│   ├── forum.test.ts           Клиент Forum и маппинг имён
│   ├── helpers.ts              Общие помощники для перехвата fetch
│   ├── market.test.ts          Клиент Market и маппинг имён
│   └── package.test.ts         Инварианты упаковки и публичного интерфейса
├── .editorconfig
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md                   Основной файл на английском
├── README.ru.md                Этот файл
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json               Конфигурация для редактора и проверки типов
├── tsconfig.build.json         Общие настройки сборки
├── tsconfig.cjs.json           Вывод CommonJS
├── tsconfig.esm.json           Вывод ES modules
└── tsconfig.types.json         Вывод деклараций
```

## Лицензия

MIT. Смотрите [LICENSE](LICENSE).

Проект не связан с LOLZTEAM, не одобрен и не спонсируется этой командой. Используйте его в соответствии с правилами площадки и применимыми условиями обслуживания.
