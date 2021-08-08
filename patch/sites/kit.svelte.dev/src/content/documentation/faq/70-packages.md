---
question: Как исправить ошибку, которая происходит при попытке импортировать пакеты?
---

Наиболее часто встречающейся проблемой является наличие компонента Svelte, который импортирует библиотеку CommonJS. В этом случае вы должны попытаться работать с авторами библиотеки над распространением ESM-версии зависимости. Тем временем вы можете обойти эту проблему, добавив зависимость в `vite.optimizeDeps.include` в `svelte.config.js`.

Кроме того, некоторые старые библиотеки Svelte плохо работают с процессом предварительной сборки Vite, ознакомьтесь с документацией `@sveltejs/vite-plugin-svelte`, чтобы узнать о текущих [ограничениях и обходных решениях](https://github.com/sveltejs/vite-plugin-svelte/tree/main/packages/vite-plugin-svelte#importing-third-party-svelte-libraries).

Если вы все еще сталкиваетесь с проблемами, мы рекомендуем проверить [список известных проблем Vite, наиболее часто затрагивающих пользователей SvelteKit](https://github.com/sveltejs/kit/issues/2086) и поискать их в [трекере проблем Vite](https://github.com/vitejs/vite/issues), или в трекере проблем соответствующей библиотеки. Иногда проблемы можно обойти, возясь со значениями конфигурации [`optimizeDeps`](https://vitejs.dev/config/#dep-optimization-options) или [`ssr`](https://vitejs.dev/config/#ssr-options).