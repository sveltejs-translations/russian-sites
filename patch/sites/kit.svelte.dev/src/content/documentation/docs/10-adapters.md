---
title: Адаптеры
---

Прежде чем развернуть приложение SvelteKit, его необходимо адаптировать для среды развертывания. Адаптеры - это небольшие плагины, которые принимают созданное приложение в качестве входных и генерируют выходные данные, оптимизированные для конкретной платформы.

Например, чтобы запустить приложение как простой сервер Node, необходимо использовать пакет `@sveltejs/adapter-node`:

```js
// svelte.config.cjs
const node = require('@sveltejs/adapter-node');

module.exports = {
	kit: {
		adapter: node()
	}
};
```

При этом, команда [`svelte-kit build`](#интерфейс-командной-строки-svelte-kit-build) сгенерирует автономное приложение Node внутри папки `build`. Так же адаптерам можно передать параметры , например настроить выходной каталог в `adapter-node`:

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
- [`adapter-static`](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) — для пререндера сайта в виде набора статических файлов

> API адаптера все еще находится в разработке и, вероятно, изменится до версии 1.0.
