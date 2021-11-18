---
question: Как использовать X вместе со SvelteKit?
---
Убедитесь, что вы прочитали [раздел документации по интеграции](/docs#dopolnitelnye-resursy-integracziya). Если у вас все еще возникают проблемы, ниже перечислены решения распространенных проблем.

### Как настроить базу данных?

Поместите код для запроса к базе данных в [эндпоинт](/docs#marshruty-endpointy) - не запрашивайте базу данных в файлах .svelte. Можно создать `db.js` или аналогичный файл, который настраивает соединение и делает клиента доступным во всем приложении в виде синглтона. Можно выполнить любой одноразовый код настройки в `hooks.js` и импортировать хелпер базы данных в любой эндпоинт.


### Как использовать мидлвары?

`adapter-node` создает мидлвары, которые можно использовать с вашим собственным сервером для производственного режима. В dev вы можете добавить мидлвару в Vite с помощью плагина Vite. Например:

```js
 const myPlugin = {
   name: 'log-request-middleware',
   configureServer(server) {
     server.middlewares.use((req, res, next) => {
       console.log(`Got request ${req.url}`);
       next();
     })
   }
 }

 /** @type {import('@sveltejs/kit').Config} */
 const config = {
 	kit: {
 		target: '#svelte',
 		vite: {
 			plugins: [ myPlugin ]
 		}
 	}
 };

 export default config;
 ```
 См. документы [Vite `configureServer`](https://vitejs.dev/guide/api-plugin.html#configureserver) для получения более подробной информации, включая управление последовательностью.


### Как использовать клиентскую библиотеку, которая зависит от `document` или `window`?

Vite попытается обработать все импортированные библиотеки и может завершиться ошибкой при обнаружении библиотеки, несовместимой с SSR. [В настоящее время это происходит, даже когда SSR отключен](https://github.com/sveltejs/kit/issues/754).

Если вам нужен доступ к переменным `document` или `window` или он должен запускаться только на стороне клиента, вы можете обернуть его проверкой `browser`:

```js
import { browser } from '$app/env';

if (browser) {
// client-only code here
}
```
Вы также можете запустить код в `onMount`, если хотите запустить его после того, как компонент был впервые отображен в DOM:

```js
import { onMount } from 'svelte';

onMount(async () => {
  const { method } = await import('some-browser-only-library');
  method('hello world');
});
```

Если библиотека, которую вы хотите использовать, свободна от побочных эффектов, вы также можете статически импортировать ее, и она будет тришейкнута в серверной сборке, где `onMount` будет автоматически заменена на no-op:

```js
import { onMount } from 'svelte';
import { method } from 'some-browser-only-library';

onMount(() => {
  method('hello world');
});
```

В противном случае, если библиотека имеет побочные эффекты и вы все равно предпочитаете использовать статический импорт, ознакомьтесь с [vite-plugin-iso-import](https://github.com/bluwy/vite-plugin-iso-import) для поддержки `?client` суффикс импорта. Импорт будет удален в сборках SSR. Однако обратите внимание, что вы потеряете возможность использовать VS Code Intellisense, если используете этот метод.

```js
import { onMount } from 'svelte';
import { method } from 'some-browser-only-library?client';

onMount(() => {
  method('hello world');
});
```

### Как использовать Firebase?

Пожалуйста, используйте Firebase SDK v9. Nакже нужно добавить зависимости Firebase в `ssr.external` ([пример](https://github.com/benmccann/sveltekit-firebase/blob/9e3097fd859e4f81e4775885ecb584561f098fd3/svelte.config

### Поддерживается ли Yarn 2?

Вроде того. Функция Plug'n'Play (или 'pnp') сломана – она резолвит Node-модули нестандартным способом и [пока не работает с нативными JavaScript модулями](https://github.com/yarnpkg/berry/issues/638), которым является SvelteKit и [непрерывно растущее число других пакетов](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77). Вы можете настроить `nodeLinker: 'node-modules'` в вашем файле [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) для отключения pnp, но возможно проще просто  использовать  npm или [pnpm](https://pnpm.io/), который так же быстр и эффективен, но лучше решает проблемы совместимости модулей.