---
title: Хуки
---

Необязательный файл `src/hooks.js` (или `src/hooks.ts`, или `src/hooks/index.js`) может экспортировать две функции, которые будут запускаться на сервере — **handle** и **getSession**.

> Расположение этого файла может быть [настроено](#konfiguracziya-files) в опции `config.kit.files.hooks`

### handle

Эта функция запускается при каждом запросе и задаёт структуру ответа от сервера. Она получает объект `request` и метод` render`, который вызывает стандартную отрисовку ответа от SvelteKit. Функция `handle` позволяет модифицировать заголовки и тело ответа или совсем не использовать SvelteKit для обработки запроса(например, для программной реализации своих эндпоинтов).

Если функция не задана будет использоваться её вариант по умолчанию `({ request, render }) => render(request)`.

Чтобы передетаь какие-либо дополнительные данные, которые нужно иметь в эндпоинтах, добавьте объекту `request` поле `locals`, как показано ниже:

```ts
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
 	locals: Locals; // определяется в фукциях хуков
};

type Response = {
	status: number;
 	headers: Headers;
 	body?: string | Uint8Array;
};

type Handle<Locals = Record<string, any>> = (input: {
 	request: Request<Locals>;
 	render: (request: Request<Locals>) => Response | Promise<Response>;
}) => Response | Promise<Response>;
```

```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, render }) {
	request.locals.user = await getUserInformation(request.headers.cookie);

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

### getSession

Эта функция принимает объект `request` и возвращает объект `session`, который [доступен на клиенте](#moduli-$app-stores) и, следовательно, должен быть безопасным для предоставления пользователям. Он запускается всякий раз, когда SvelteKit выполняет рендеринг страницы на сервере.

Если функция не задана, объект сессии будет равен `{}`.

```ts
type GetSession<Locals = Record<string, any>, Session = any> = {
	(request: Request<Locals>): Session | Promise<Session>;
};
```

```js
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
	return {
		user: {
			// only include properties needed client-side —
			// exclude anything else attached to the user
			// like access tokens etc
			name: request.locals.user?.name,
			email: request.locals.user?.email,
			avatar: request.locals.user?.avatar
		}
	};
}
```

> Объект `session` должен быть сериализуемым, то есть  не должен содержать вещей вроде функций или классов, только встроенные в JavaScript типы данных.