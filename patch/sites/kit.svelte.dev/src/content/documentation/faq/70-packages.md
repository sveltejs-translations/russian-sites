---
question: Как исправить ошибку, которая происходит при попытке импортировать пакеты?
---

SSR в Vite еще не стабилен. Библиотеки лучше всего работают с Vite, когда они собраны в CJS или ESM в своем пакете, и вы можете работать с авторами библиотек, чтобы это произошло.

Компоненты Svelte должны быть полностью написаны в ESM. Рекомендуется убедиться, что зависимости внешних компонентов Svelte предоставляют версию ESM. Однако для обработки зависимостей CJS [`vite-plugin-svelte` будет искать любые зависимости CJS внешних компонентов Svelte](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies) и попросит Vite предварительно сгруппировать их, автоматически добавив их в `optimizeDeps.include` Vite, который будет использовать `esbuild` для преобразования их в ESM.

При таком подходе загрузка начальной страницы занимает больше времени. Если это становится заметным, попробуйте установить [experimental.prebundleSvelteLibraries: true](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#prebundlesveltelibraries) в `svelte.config.js`. Обратите внимание, что эта опция является экспериментальной.

Если вы все еще сталкиваетесь с проблемами, мы рекомендуем проверить [список известных проблем Vite, наиболее часто затрагивающих пользователей SvelteKit](https://github.com/sveltejs/kit/issues/2086) и поискать их в [трекере проблем Vite](https://github.com/vitejs/vite/issues), или в трекере проблем соответствующей библиотеки. Иногда проблемы можно обойти, возясь со значениями конфигурации [`optimizeDeps`](https://vitejs.dev/config/#dep-optimization-options) или [`ssr`](https://vitejs.dev/config/#ssr-options).