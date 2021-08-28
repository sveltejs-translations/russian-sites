---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать четыре функции, которые будут запускаться на сервере — **handle**, **handleError**, **getSession** и **externalFetch**.

> Расположение этого файла может быть [настроено](#konfiguracziya-files) в опции `config.kit.files.hooks`

### handle

Эта функция запускается каждый раз, когда SvelteKit получает запрос - независимо от того, происходит ли это во время работы приложения или во время [пререндеринга](#ssr-and-javascript-prerender) - и определяет ответ. Он получает объект `request` и функцию с именем `resolve`, которая вызывает маршрутизатор SvelteKit и генерирует ответ (отображение страницы или вызов эндпоинта) соответственно. Это позволяет изменять заголовки или тела ответов или полностью обойти SvelteKit (например, для программной реализации эндпоинтов).

> Запросы на статические активы, которые включают страницы, которые уже были предварительно отрендерены, _не_ обрабатываются SvelteKit.

Если функция не задана будет использоваться её вариант по умолчанию `({ request, resolve }) => resolve(request)`.

```ts
// Declaration types for Hooks
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

type StrictBody = string | Uint8Array;
// ServerResponse is exported as Response
export interface ServerResponse {
	status: number;
	headers: ResponseHeaders;
 	body?: StrictBody;
}

export interface Handle<Locals = Record<string, any>> {
 	(input: {
 		request: ServerRequest<Locals>;
 		resolve(request: ServerRequest<Locals>): ServerResponse | Promise<ServerResponse>;
 	}): ServerResponse | Promise<ServerResponse>;
}
```
Чтобы передать какие-либо дополнительные данные, которые нужно иметь в эндпоинтах, добавьте объекту `request` поле `locals`, как показано ниже:

```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, render }) {
	request.locals.user = await getUserInformation(request.headers.cookie);

	const response = await resolve(request);

	return {
		...response,
		headers: {
			...response.headers,
			'x-custom-header': 'potato'
		}
	};
}
```


### handleError

Если во время рендеринга возникает ошибка, эта функция будет вызвана с параметрами `error` и `request`, который ее вызвал. Это позволяет отправлять данные в службу отслеживания ошибок или настраивать форматирование перед печатью ошибки в консоли.

Если, во время разработки, возникает синтаксическая ошибка в коде Svelte, будет добавлен параметр `frame`, выделяющий местоположение ошибки.

Если не реализовано, SvelteKit зарегистрирует ошибку с форматированием по умолчанию.

```ts
// Declaration types for handleError hook

export interface HandleError<Locals = Record<string, any>> {
	(input: { error: Error & { frame?: string }; request: ServerRequest<Locals> }): void;
}
```

```js
/** @type {import('@sveltejs/kit').HandleError} */
export async function handleError({ error, request }) {
	// example integration with https://sentry.io/
	Sentry.captureException(error, { request });
}
```

> `handleError` вызывается только в случае непойманного исключения. Он не вызывается, когда страницы и эндпоинты явно отвечают кодами состояния 4xx и 5xx.


### getSession

Эта функция принимает объект `request` и возвращает объект `session`, который [доступен на клиенте](#moduli-$app-stores) и, следовательно, должен быть безопасным для предоставления пользователям. Он запускается всякий раз, когда SvelteKit выполняет рендеринг страницы на сервере.

Если функция не задана, объект сессии будет равен `{}`.

```ts
// Declaration types for getSession hook

export interface GetSession<Locals = Record<string, any>, Session = any> {
 	(request: ServerRequest<Locals>): Session | Promise<Session>;
}
```

```js
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
	return request.locals.user
 		? {
			user: {
				// only include properties needed client-side —
				// exclude anything else attached to the user
				// like access tokens etc
				name: request.locals.user.name,
				email: request.locals.user.email,
				avatar: request.locals.user.avatar
			}
 		  }
 		: {};
}
```

> Объект `session` должен быть сериализуемым, то есть не должен содержать вещей вроде функций или классов, только встроенные в JavaScript типы данных.


### externalFetch

Эта функция позволяет изменять (или заменять) запрос `fetch` для **внешнего ресурса** внутри функции `load`, которая выполняется на сервере (или во время предварительной отрисовки).

Например, ваша функция `load` может делать запрос на публичный URL-адрес, такой как `https://api.yourapp.com`, когда пользователь выполняет навигацию на стороне клиента на соответствующую страницу, но во время SSR может иметь смысл напрямую связаться с API (обходя любые прокси и балансировщики нагрузки, находящие между ним и публичным интернетом).

```ts
// Declaration types for externalFetch hook

export interface ExternalFetch {
	(req: Request): Promise<Response>;
}
```

```js
/** @type {import('@sveltejs/kit').ExternalFetch} */
export async function externalFetch(request) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
	// клонировать исходный запрос, но изменить URL-адрес
	request = new Request(
		request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
		request
	);
}
	return fetch(request);
}
```