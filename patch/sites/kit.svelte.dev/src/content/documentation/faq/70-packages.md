---
question: Как исправить ошибку, которая происходит при попытке импортировать пакеты?
---

Старые бета-версии шаблона SvelteKit включали значение конфигурации `noExternal: Object.keys (pkg.dependencies || {})` в `svelte.config.js`. Во-первых, проверьте, присутствует ли эта строка в вашем проекте, и удалите ее, если таковая имеется. Удаление этой строки устраняет большинство проблем, и с тех пор она была удалена из шаблона.

> Имейте ввиду, что вы больше не сможете напрямую импортировать JSON файлы оператором request, т.к. SvelteKit ожидает, что [`svelte.config.js`](/docs#konfiguracziya) будет ES модулем. Вы можете загрузить JSON таким образом:
>
> ```js
> const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));
> ```

Вторая наиболее часто встречающаяся проблема - наличие компонента Svelte, импортирующего библиотеку CommonJS. В этом случае вам следует попытаться поработать с авторами библиотеки над публикацией ESM версии зависимости. Тем не менее, вы можете обойти эту проблему, добавив зависимость для `vite.optimizeDeps.include` в `svelte.config.js`.

Кроме того, некоторые старые библиотеки Svelte плохо работают с процессом предварительной сборки Vite, ознакомьтесь с документацией `@sveltejs/vite-plugin-svelte`, чтобы узнать о текущих [ограничениях и обходных решениях](https://github.com/sveltejs/vite-plugin-svelte/tree/main/packages/vite-plugin-svelte#importing-third-party-svelte-libraries).

Если вы все еще сталкиваетесь с проблемами, мы рекомендуем поискать их в [трекере проблем Vite](https://github.com/vitejs/vite/issues), или в трекере проблем соответствующей библиотеки. Иногда проблемы можно обойти, возясь со значениями конфигурации [`optimizeDeps`](https://vitejs.dev/config/#dep-optimization-options) или [`ssr`](https://vitejs.dev/config/#ssr-options).