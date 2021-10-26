---
title: Файлы проекта
---

Большую часть вашего приложения, в `src/routes`, можно оставить там, где оно есть, но несколько файлов проекта необходимо будет переместить или обновить.

### Конфигурация

Замените `webpack.config.js` или `rollup.config.js` на `svelte.config.js`, как описано в [документации](/docs#konfiguracziya). Опции препроцессора переместите в `config.preprocess`.

Добавьте [адаптер](/docs#adaptery): 
* `sapper build` ~ [adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node);
* `sapper export` ~ [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static);
* или адаптер, для вашей платформы.

Если вы использовали плагины для типов файлов, которые не обрабатываются автоматически [Vite](https://vitejs.dev), вам нужно будет найти их эквиваленты для Vite и добавить в [Vite config](/docs#konfiguracziya-vite).

### src/client.js

У этого файла нет эквивалента в SvelteKit. Любая настраиваемая логика (за пределами `sapper.start(...)`) должна быть описана в `__layout.svelte`, внутри функции обратного вызова `onMount`.

### src/server.js

Этот файл также не имеет прямого эквивалента, поскольку приложения SvelteKit могут работать в бессерверных средах. Однако вы можете использовать [файл хуков](/docs#huki) для реализации логики сессии.

### src/service-worker.js

Большая часть импорта из `@sapper/service-worker` имеет эквиваленты в [`$service-worker`](/docs#moduli-service-worker):

- `timestamp` - без изменений
- `files` - без изменений
- `shell` => `build`
- `routes` - удалён

### src/template.html

Файл `src/template.html` следует переименовать в `src/app.html`.

Удалите `%sapper.base%`, `%sapper.scripts%` и `%sapper.styles%`. Замените `%sapper.head%` на `%svelte.head%` и `%sapper.html%` на `%svelte.body%`.

`<div id="sapper">` больше не нужен, хотя вы можете монтировать приложение к любому элементу, указав его с помощью параметра конфигурации [`target`](/docs#konfiguracziya-target).

### src/node_modules

Распространенный шаблон в приложениях Sapper - поместить вашу внутреннюю библиотеку в каталоге внутри `src/node_modules`. Это не работает с Vite, поэтому мы используем [`src/lib`](/docs#moduli-$lib) вместо него.