---
title: Интеграции
---

См. [FAQ](/faq#integrations) для получения подробной информации об интеграции.

### HTML-минификатор

Sapper по умолчанию включает `html-minifier`. SvelteKit не включает это, но его можно добавить как [хук](/docs#huki-handle):

```js
 import { minify } from 'html-minifier';
 import { prerendering } from '$app/env';

 const minification_options = {
 	collapseBooleanAttributes: true,
 	collapseWhitespace: true,
 	conservativeCollapse: true,
 	decodeEntities: true,
 	html5: true,
 	ignoreCustomComments: [/^#/],
 	minifyCSS: true,
 	minifyJS: false,
 	removeAttributeQuotes: true,
 	removeComments: true,
 	removeOptionalTags: true,
 	removeRedundantAttributes: true,
 	removeScriptTypeAttributes: true,
 	removeStyleLinkTypeAttributes: true,
 	sortAttributes: true,
 	sortClassName: true
 };

 export async function handle({ request, render }) {
   const response = await render(request);

   if (prerendering && response.headers['content-type'] === 'text/html') {
     response.body = minify(response.body, minification_options);
   }

   return response;
 }
 ```

 Обратите внимание, что `prerendering` имеет значение `false` при использовании `svelte-kit preview` для тестирования продакшн сборки сайта, поэтому для проверки результатов минификации необходимо напрямую проверить созданные файлы HTML.