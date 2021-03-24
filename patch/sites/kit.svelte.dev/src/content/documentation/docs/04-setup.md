---
title: Установки
---

Необязательный файл `src/setup.js` (или `src/setup.ts`, или `src/setup/index.js`) может экспортировать две функции, которые будут запускаться на сервере — **prepare** и **getSession**.

Обе функции будут запускаться когда SvelteKit получает любой запрос страницы или эндпоинта.

> Расположение этого файла может быть [настроено](#конфигурация-files) в опции `config.kit.files.setup`

### prepare

Эта функция получает входящие заголовки и может возвращать `context` и заголовки для ответа в `headers`:

```js
/**
 * @param {{
 *   headers: Record<string, string>
 * }} incoming
 * @returns {Promise<{
 *   headers?: Record<string, string>
 *   context?: any
 * }>}
 */
export async function prepare({ headers }) {
	return {
		headers: {...},
		context: {...}
	};
}
```

Заголовки из объекта `headers` будут добавлены в ответ сервера вместе с любыми другими заголовками от эндпоинтов(которые имеют приоритет). Это может быть полезно, например чтобы установить cookie:


```js
import * as cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

export async function prepare(incoming) {
	const cookies = cookie.parse(incoming.headers.cookie || '');

	const headers = {};
	if (!cookies.session_id) {
		headers['set-cookie'] = `session_id=${uuid()}; HttpOnly`;
	}

	return {
		headers
	};
}
```

Объект `context` передаётся эндпоинтам и используется в функции `getSession` для извлечения объекта сессии, который будет доступен в браузере. Это самое подходящее место для хранении информации о текущем пользователе, например:

```diff
import * as cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
+import db from '$lib/db';

export async function prepare(incoming) {
	const cookies = cookie.parse(incoming.headers.cookie || '');

	const headers = {};
	if (!cookies.session_id) {
		headers['set-cookie'] = `session_id=${uuid()}; HttpOnly`;
	}

	return {
-		headers
+		headers,
+		context: {
+			user: await db.get_user(cookies.session_id)
+		}
	};
}
```


### getSession
Эта функция принимает объект `context`, который был возвращён из функции `prepare` и возвращает объект сессии, который можно безопасно передать в браузер.

```js
/**
 * @param {{
 *   context: any
 * }} options
 * @returns {any}
 */
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