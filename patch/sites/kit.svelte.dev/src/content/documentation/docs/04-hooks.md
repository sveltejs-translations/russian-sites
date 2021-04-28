---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать три функции, которые будут запускаться на сервере — **getContext**, **getSession** и **handle**

> Расположение этого файла может быть [настроено](#конфигурация-files) в опции `config.kit.files.hooks`

### getContext

Эта функция будет запускаться при каждом входящем запросе. Она возвращает объект, который будет доступен обработчикам в [эндпоинтах](#маршруты-эндпоинты) как `request.context`. На основе этого объекта формируется объект [`session`](#хуки-getsession), который будет доступен в браузере.

Если функция не была задана, то объект `context` будет равен`{}`.

```ts
type Incoming = {
	method: string;
	host: string;
	headers: Headers;
	path: string;
	query: URLSearchParams;
	body: string | Buffer | ReadOnlyFormData;
};
type GetContext<Context = any> = {
	(incoming: Incoming): Context;
};
```

```js
import * as cookie from 'cookie';
import db from '$lib/db';
/** @type {import('@sveltejs/kit').GetContext} */
export async function getContext({ headers }) {
	const cookies = cookie.parse(headers.cookie || '');
	return {
		user: (await db.get_user(cookies.session_id)) || { guest: true }
	};
}
```

### getSession

Эта функция принимает объект [`context`](#хуки-getcontext) и возвращает объект сессии, который можно безопасно передать в браузер. Эта функция запускается всякий раз, когда SvelteKit отрисовывает страницу на сервере.

Если функция не задана, объект сессии будет равен `{}`.

```ts
type GetSession<Context = any, Session = any> = {
	({ context }: { context: Context }): Session | Promise<Session>;
};
```

```js
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession({ context }) {
	return {
		user: {
			// укажите здесь только необходимые клиенту свойства,
			// не указывайте другой информации вроде
			// токенов, ключей или хешей
			name: context.user?.name,
			email: context.user?.email,
			avatar: context.user?.avatar
		}
	};
}
```
> Объект `session` должен быть сериализуемым, то есть  не должен содержать вещей вроде функций или классов, только встроенные в JavaScript типы данных.

### handle
Эта функция запускается при каждом запросе и задаёт структуру ответа от сервера. Она получает объект `request` и метод` render`, который вызывает стандартную отрисовку ответа от SvelteKit. Функция `handle` позволяет модифицировать заголовки и тело ответа или совсем не использовать SvelteKit для обработки запроса(например, для программной реализации своих эндпоинтов).
Если функция не задана будет использоваться её вариант по умолчанию `({ request, render }) => render(request)`.
```ts
type Request<Context = any> = {
	method: string;
	host: string;
	headers: Headers;
	path: string;
	params: Record<string, string>;
	query: URLSearchParams;
	rawBody: string | ArrayBuffer;
 	body: string | ArrayBuffer | ReadOnlyFormData | any;
	context: Context;
};
type Response = {
	status?: number;
	headers?: Headers;
	body?: any;
};
type Handle<Context = any> = ({
	request: Request<Context>,
	render: (request: Request<Context>) => Promise<Response>
}) => Response | Promise<Response>;
```
```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, render }) {
	const response = await render(request);
	return {
		...response,
		headers: {
			...response.headers,
			'x-custom-header': 'potato'
		}
	};
}
```
