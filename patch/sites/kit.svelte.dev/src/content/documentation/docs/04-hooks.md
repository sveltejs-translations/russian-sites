---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать три функции, которые будут запускаться на сервере — **handle**,  **getSession** и **serverFetch**.

> Расположение этого файла может быть [настроено](#konfiguracziya-files) в опции `config.kit.files.hooks`

### handle

Эта функция запускается на каждый запрос страницы или эндпоинта и задаёт структуру ответа. Она получает объект `request` и функцию `resolve`, которая обращается к роутеру SvelteKit и генерирует соответствующий ответ. Функция `handle` позволяет модифицировать заголовки и тело ответа или совсем не использовать SvelteKit для обработки запроса(например, для программной реализации своих эндпоинтов).

Если функция не задана будет использоваться её вариант по умолчанию `({ request, resolve }) => resolve(request)`.

```ts
// handle TypeScript type definitions

type Headers = Record<string, string>;

type Request<Locals = Record<string, any>> = {
	method: string;
	host: string;
	headers: Headers;
	path: string;
	params: Record<string, string>;
	query: URLSearchParams;
	rawBody: string | Uint8Array;
 	body: ParameterizedBody<Body>;
 	locals: Locals; // устанавливается в хуке handle
};

type Response = {
	status: number;
 	headers: Headers;
 	body?: string | Uint8Array;
};

type Handle<Locals = Record<string, any>> = (input: {
 	request: Request<Locals>;
 	resolve: (request: Request<Locals>) => Response | Promise<Response>;
}) => Response | Promise<Response>;
```
Чтобы передетаь какие-либо дополнительные данные, которые нужно иметь в эндпоинтах, добавьте объекту `request` поле `locals`, как показано ниже:

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
type HandleError = HandleError<Locals = Record<string, any>> {
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
// getSession TypeScript type definition

type GetSession<Locals = Record<string, any>, Session = any> = {
	(request: Request<Locals>): Session | Promise<Session>;
};
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


### serverFetch

Эта функция позволяет изменять (или заменять) запрос `fetch` для **внешнего ресурса** внутри функции `load`, которая выполняется на сервере (или во время предварительной отрисовки).

Например, ваша функция `load` может делать запрос на публичный URL-адрес, такой как `https://api.yourapp.com`, когда пользователь выполняет навигацию на стороне клиента на соответствующую страницу, но во время SSR может иметь смысл напрямую связаться с API (обходя любые прокси и балансировщики нагрузки, находящие между ним и публичным интернетом).

```ts
 type ServerFetch = (req: Request) => Promise<Response>;
```

```js
/** @type {import('@sveltejs/kit').ServerFetch} */
export async function serverFetch(request) {
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