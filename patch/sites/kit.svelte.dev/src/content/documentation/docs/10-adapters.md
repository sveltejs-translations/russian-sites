---
title: Адаптеры
---

Прежде чем развернуть готовое приложение SvelteKit на сервере или сервисе, его необходимо адаптировать под то окружение, в котором оно будет работать. Адаптеры - это небольшие плагины, которые берут собранное приложение и выдают оптимизированную для конкретной платформы сборку.

Например, чтобы запустить приложение как простой Node-сервер, необходимо использовать адаптер `@sveltejs/adapter-node`:

```js
// svelte.config.cjs
const node = require('@sveltejs/adapter-node');

module.exports = {
	kit: {
		adapter: node()
	}
};
```

В таком случае, команда [`svelte-kit build`](#интерфейс-командной-строки-svelte-kit-build) сгенерирует приложение Node внутри папки `build`, которое можно запустить автономно. Также адаптерам можно передать параметры , например настроить выходной каталог в `adapter-node`:

```diff
// svelte.config.cjs
const node = require('@sveltejs/adapter-node');

module.exports = {
	kit: {
-		adapter: node()
+		adapter: node({ out: 'my-output-directory' })
	}
};
```

Для бессерверных платформ существует множество официальных адаптеров...

- [`adapter-begin`](https://github.com/sveltejs/kit/tree/master/packages/adapter-begin) — для [begin.com](https://begin.com)
- [`adapter-netlify`](https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify) — для [netlify.com](https://netlify.com)
- [`adapter-vercel`](https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel) — для [vercel.com](https://vercel.com)

...и другие:

- [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) — для создания автономных приложений Node
- [`adapter-static`](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) — для пререндера приложения и получения статического сайта

> API адаптера все еще находится в разработке и, вероятно, изменится до версии 1.0.
