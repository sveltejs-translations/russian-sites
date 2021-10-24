---
title: Маршруты
---

Сердцем SvelteKit является _роутер основанный на файловой системе_. Это означает, что структура вашего приложения определяется структурой файлов его исходников – в частности содержимым папки `src/routes`.

> Можно указать другую директорию в файле [конфигурации проекта](#konfiguracziya).

Существует два типа маршрутов — **страницы** и **эндпоинты**.

Страницы обычно отдают HTML-код для отображения пользователю ( а также CSS и JavaScript, необходимые странице). По умолчанию они отрисовываются как на сервере, так и на клиенте, но это поведение можно настроить.

Эндпоинты запускаются только на сервере (или при сборке сайта, если используется [предварительная отрисовка](#ssr-i-javascript-prerender)). Это то место, где можно выполнять запросы к базам данных или API с приватной авторизацией, а также вывести иные данные которые доступны на сервере. Страницы могут получать данные от эндпоинтов. По умолчанию эндпоинты возвращают ответ в формате JSON, но могут также возвращать данные в любых других форматах.

### Страницы

Страницы — это компоненты Svelte, описанные в файлах `.svelte`(или любой файл с расширением, указанным в [`config.extensions`](#konfiguracziya)). По умолчанию, когда пользователь впервые посещает приложение, ему будет отправлена сгенерированная на сервере версия запрошенной страницы, а также некоторый JavaScript, который выполняет 'гидрацию' страницы и инициализирует роутер на стороне клиента. С этого момента навигация на другие страницы будет полностью выполняться на стороне клиента обеспечивая очень быстрое перемещение, что типично для клиентских приложений, где некоторая часть разметки не требует перерисовки.

Имя файла определяет маршрут. Например, `src/routes/index.svelte` — корневой файл вашего сайта:


```html
<!-- src/routes/index.svelte -->
<svelte:head>
	<title>Добро пожаловать!</title>
</svelte:head>

<h1>Приветствую вас на моём сайте!</h1>
```

Файл с именем `src/routes/about.svelte` или `src/routes/about/index.svelte` будет соответствовать маршруту `/about`:

```html
<!-- src/routes/about.svelte -->
<svelte:head>
	<title>О сайте</title>
</svelte:head>

<h1>Информация о сайте</h1>
<p>Это самый лучший сайт!</p>
```

Динамические параметры задаются при помощи квадратных скобок [...]. Например, можно определить страницу, отображающую статью из блога, таким образом – `src/routes/blog/[slug].svelte`. Скоро мы увидим как получить доступ к этому параметру в 
[функции load](#zagruzka-dannyh) или [в хранилище страницы](#moduli-$app-stores). 

Файл или каталог может иметь несколько динамических частей, например `[id]-[category].svelte`. (Параметры «не жадные»; и в неоднозначном случае, типа `x-y-z`, `id` будет `x`, а `category` будет `y-z`.)


### Эндпоинты

Эндпоинты — это модули, написанные в файлах `.js` (или `.ts`), которые экспортируют функции, соответствующие HTTP методам.

```ts
// Declaration types for Endpoints
// * declarations that are not exported are for internal use

// type of string[] is only for set-cookie
// everything else must be a type of string
type ResponseHeaders = Record<string, string | string[]>;
type RequestHeaders = Record<string, string>;

export type RawBody = null | Uint8Array;
export interface IncomingRequest {
	method: string;
	host: string;
	path: string;
	query: URLSearchParams;
	headers: RequestHeaders;
 	rawBody: RawBody;
};

type ParameterizedBody<Body = unknown> = Body extends FormData
 	? ReadOnlyFormData
 	: (string | RawBody | ReadOnlyFormData) & Body;
 // ServerRequest is exported as Request
 export interface ServerRequest<Locals = Record<string, any>, Body = unknown>
 	extends IncomingRequest {
 	params: Record<string, string>;
 	body: ParameterizedBody<Body>;
 	locals: Locals; // устанавливается в хуке handle
}

type DefaultBody = JSONResponse | Uint8Array;
export interface EndpointOutput<Body extends DefaultBody = DefaultBody> {
	status?: number;
	headers?: ResponseHeaders;
	body?: Body;
};

export interface RequestHandler<
 	Locals = Record<string, any>,
 	Input = unknown,
 	Output extends DefaultBody = DefaultBody
> {
 	(request: ServerRequest<Locals, Input>):
 		| void
 		| EndpointOutput<Output>
 		| Promise<void | EndpointOutput<Output>>;
}
```
Например, наша гипотетическая страница блога `/blog/cool-article`, может запрашивать данные из `/blog/cool-article.json`, который может быть представлен эндпоинтом `src/routes/blog/[slug].json.js`:

```js
import db from '$lib/database';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
	// у нас есть доступ к параметру `slug`, потому что
	// файл называется [slug].json.js
	const { slug } = params;

	const article = await db.get(slug);

	if (article) {
		return {
			body: {
				article
			}
		};
	} 
}
```
<!-- > Если из функции ничего не возвращается, это вызовет ответ с кодом ошибки 404. -->
> Весь код на стороне сервера, включая конечные точки, имеет доступ к `fetch` на случай, если вам нужно запросить данные из внешних API.

Цель данной функции – вернуть объект `{ status, headers, body }`, который является ответом на запрос, где `status` является [кодом ответа HTTP](https://httpstatusdogs.com):

- `2xx` — успешный ответ (по умолчанию `200`)
- `3xx` — перенаправление (используется совместно с заголовком `location`)
- `4xx` — ошибка от клиента
- `5xx` — ошибка на сервере

Если `body` является объектом и в `headers` нет заголовка `content-type`, то он по автоматически превратится в JSON строку. Пока не обращайте внимание на `$lib`, об этом мы узнаем [позднее](#moduli-$lib).

> Ничего не возвращать равносильно явному ответу 404.

Для эндпоинтов, которые должны обрабатывать иные HTTP методы, например POST, экспортируйте соответствующую функцию:

```js
export function post(request) {...}
```

Поскольку `delete` является зарезервированным словом JavaScript, запросы методом DELETE обрабатываются функцией с именем `del`.

> Мы не взаимодействуем с объектами `req`/`res`, которые могут быть вам знакомы из Node-модуля `http` или фреймворков типа Express, потому что они доступны только на некоторых платформах. Вместо этого, SvelteKit переводит возвращённый объект в то что будет понятно платформе, куда вы будете загружать своё готовое приложение. 

Чтобы установить несколько файлов cookie в одном наборе заголовков ответа, вы можете вернуть массив:

```js
return {
	headers: {
		'set-cookie': [cookie1, cookie2]
	}
};
```

#### Body парсинг

Свойство `body` объекта request будет предоставлено в случае POST-запросов:

- Текстовые данные (с типом содержимого `text/plain`) будут разобраны в `string`
- Данные JSON (с типом содержимого `application/json`) будут разобраны до `JSONValue` (`object`, `Array` или примитив).
- Данные формы (с типом содержимого `application/x-www-form-urlencoded` или `multipart/form-data`) будут разобраны только для чтения версии объекта [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
- Все остальные данные будут предоставлены в виде `Uint8Array`

### Приватные модули 

Пути файлов, в которых есть часть начинающаяся с символа нижнего подчёркивания, такие как `src/routes/foo/_Private.svelte` или `src/routes/bar/_utils/cool-util.js`, будут спрятаны от роутера, но могут быть импортированы в другие файлы, которые ему видны.


### Дополнительно

#### Rest-параметры

Маршрут может иметь несколько динамических параметров, например `src/routes/[category]/[item].svelte`, или даже `src/routes/[category]-[item].svelte`. Если количество частей маршрута заранее неизвестно, можно воспользоваться rest-синтаксисом – например, реализация просмотра файлов на GitHub будет выглядеть так...

```bash
/[org]/[repo]/tree/[branch]/[...file]
```

...и в данном случае запрос для маршрута `/sveltejs/kit/tree/master/documentation/docs/01-routing.md` будет преобразован в следующие параметры, доступные на этой странице:

```js
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'master',
	file: 'documentation/docs/01-routing.md'
}
```

> `src/routes/a/[...rest]/z.svelte` будет соответствовать `/a/z` также как `/a/b/z` и `/a/b/c/z` и так далее. Убедитесь, что вы проверили правильность значения rest-параметров.


#### Перебор маршрутов

В случае, когда в приложении существует несколько маршрутов, которые подходят под заданный URL, SvelteKit будет пробовать загрузить каждый из них, пока кто-то из них не ответит. Например у вас есть такие маршруты... 

```bash
src/routes/[baz].js
src/routes/[baz].svelte
src/routes/[qux].svelte
src/routes/foo-[bar].svelte
```
...и вы собираетесь перейти на страницу `/foo-xyz`, в таком случае SvelteKit сначала попробует загрузить `foo-[bar].svelte`, потому что он подходит больше всех, затем попробует `[baz].js` (который, тоже подходит для `/foo-xyz`, но менее специфичен), затем `[baz].svelte` и `[qux].svelte` в алфавитном порядке (эндпоинты имеют больший приоритет, чем страницы). Первый маршрут, который ответит – то есть страница, которая вернёт что-то из функции [`load`](#zagruzka-dannyh) или страница в котрой этой функции нет, или эндпоинт который что-то возвращает – будет обрабатывать поступивший запрос.

Если ни одна страница или эндпоинт не ответит на запрос, SvelteKit вернёт ответ с кодом 404.