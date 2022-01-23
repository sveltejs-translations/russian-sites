---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать четыре функции, которые будут запускаться на сервере — **handle**, **handleError**, **getSession** и **externalFetch**.

> Расположение этого файла может быть [настроено](#konfiguracziya-files) в опции `config.kit.files.hooks`

### handle

Эта функция запускается каждый раз, когда SvelteKit получает запрос - происходит ли это во время работы приложения или во время [prerendering](#parametry-straniczy-prerender) - и определяет ответ. Он получает объект `event`, представляющий запрос, и функцию `resolve`, которая вызывает маршрутизатор SvelteKit и генерирует ответ (рендеринг страницы или вызов конечной точки) соответственно. Это позволяет изменять заголовки или тела ответов или полностью обойти SvelteKit (например, для программной реализации конечных точек).

> Запросы на статические активы, которые включают страницы, которые уже были предварительно отрендерены, _не_ обрабатываются SvelteKit.

Если функция не задана будет использоваться её вариант по умолчанию `({ event, resolve }) => resolve(event)`.

```ts
// Declaration types for Hooks
// * declarations that are not exported are for internal use

// type of string[] is only for set-cookie
// everything else must be a type of string
type ResponseHeaders = Record<string, string | string[]>;

export interface RequestEvent<Locals = Record<string, any>> {
	request: Request;
 	url: URL;
	params: Record<string, string>;
	locals: Locals;
}

export interface ResolveOpts {
 	ssr?: boolean;
}

export interface Handle<Locals = Record<string, any>> {
 	event: RequestEvent<Locals>;
 		resolve(event: RequestEvent<Locals>, opts?: ResolveOpts): MaybePromise<Response>;
 	}): MaybePromise<Response>;
}
```
Чтобы передать какие-либо дополнительные данные, которые нужно иметь в эндпоинтах, добавьте объект `event.locals`, как показано ниже:

```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
 	event.locals.user = await getUserInformation(event.request.headers.get('cookie'));

	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');

	return response;
}
```

Вы можете добавить несколько функций в `handle` с [помощью хелпера `sequence`](#moduli-sveltejs-kit-hooks).

`resolve` также поддерживает второй, необязательный параметр, который дает вам больше контроля над тем, как будет отображаться ответ. Этот параметр является объектом, который может иметь следующие поля:

- `ssr` - указывает, будет ли страница загружена и отображаться на сервере.

```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
 	const response = await resolve(event, {
 		ssr: !event.url.pathname.startsWith('/admin')
 	});

 	return response;
}
 ```

> Отключение [рендеринга на стороне сервера](#prilozhenie-ssr) эффективно превращает ваше приложение SvelteKit в [**одностраничное приложение** или SPA](#prilozhenie-csr-and-spa). В большинстве ситуаций это не рекомендуется ([см. приложение](#prilozhenie-ssr)). Подумайте, действительно ли уместно его отключить, и сделайте это выборочно, а не для всех запросов.

### handleError

Если во время рендеринга возникает ошибка, эта функция будет вызвана с параметрами `error` и `request`, который ее вызвал. Это позволяет отправлять данные в службу отслеживания ошибок или настраивать форматирование перед печатью ошибки в консоли.

Если, во время разработки, возникает синтаксическая ошибка в коде Svelte, будет добавлен параметр `frame`, выделяющий местоположение ошибки.

Если не реализовано, SvelteKit зарегистрирует ошибку с форматированием по умолчанию.

```ts
// Declaration types for handleError hook
export interface HandleError<Locals = Record<string, any>> {
	(input: { error: Error & { frame?: string }; event: RequestEvent<Locals> }): void;
}
```

```js
/** @type {import('@sveltejs/kit').HandleError} */
export async function handleError({ error, event }) {
	// example integration with https://sentry.io/
	Sentry.captureException(error, { event });
}
```

> `handleError` вызывается только в случае непойманного исключения. Он не вызывается, когда страницы и эндпоинты явно отвечают кодами состояния 4xx и 5xx.


### getSession

Эта функция принимает объект `event` и возвращает объект `session`, который [доступен на клиенте](#moduli-$app-stores) и, следовательно, должен быть безопасным для предоставления пользователям. Он запускается всякий раз, когда SvelteKit выполняет рендеринг страницы на сервере.

Если функция не задана, объект сессии будет равен `{}`.

```ts
// Declaration types for getSession hook
export interface GetSession<Locals = Record<string, any>, Session = any> {
 	(event: RequestEvent<Locals>): Session | Promise<Session>;
}
```

```js
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
 	return event.locals.user
 		? {
			user: {
				// only include properties needed client-side —
				// exclude anything else attached to the user
				// like access tokens etc
				name: event.locals.user.name,
				email: event.locals.user.email,
				avatar: event.locals.user.avatar
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