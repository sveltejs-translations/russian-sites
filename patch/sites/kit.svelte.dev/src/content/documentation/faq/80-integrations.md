---
question: Как использовать X вместе со SvelteKit?
---

### Как настроить библиотеку X?

Пожалуйста, ознакомьтесь с сайтом сообщества [sveltesociety.dev](https://sveltesociety.dev/templates) для примеров использования многих популярных библиотек, таких как Tailwind, PostCSS, Firebase, GraphQL, mdsvex и многое другое. Мы рекомендуем использовать [Svelte adders](https://sveltesociety.dev/templates#category-Svelte%20Add), которые позволяют запустить сценарий для автоматического добавления популярных технологий во вновь созданный проект SvelteKit.


### Как использовать `svelte-preprocess`?

`svelte-preprocess` обеспечивает поддержку Babel, CoffeeScript, Less, PostCSS/SugarSS, Pug, scss/sass, Stylus, TypeScript, стилей `global` и replace. Добавление [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) в ваш [`svelte.config.js`](/docs#konfiguracziya) - это первый шаг. Он предоставляется шаблоном, если вы используете TypeScript. Пользователям JavaScript нужно будет добавить его. Для многих инструментов, перечисленных выше, вам потребуется только установить соответствующую библиотеку, такую ​​как `npm install -D sass` или` npm install -D less`. См. Документацию [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) для получения полной информации.


### Как использовать Firebase?

Используйте SDK v9, с модульным подходом SDK, который в настоящее время на стадии бета-тестирования. Старые версии очень трудно заставить работать, особенно с SSR, они очень сильно уыеличивают размер бандла клиента. Даже в версии 9 большинству пользователей необходимо установить `kit.ssr: false` до тех пор, пока не будут решены [vite#4425](https://github.com/vitejs/vite/issues/4425) и [firebase-js-sdk#4846](https://github.com


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


### Как настроить базу данных?

Поместите код запросов к базе данных в [эндпоинты](/docs#marshruty-endpointy) - не обращайтесь к БД в файлах .svelte. Вы можете создать файл `db.js` или аналогичный, который будет устанавливать соединение с БД и предоставлять к ней доступ всему приложению. Импортируйте в файл `hooks.js` метод устанавливающий соединение с базой и любой другой код, который должен выполняться единоразово при старте приложения, а в эндпоинты импортируйте функции для выполнения запросов в БД.


### Поддерживается ли Yarn 2?

Вроде того. Функция Plug'n'Play (или 'pnp') сломана – она резолвит Node-модули нестандартным способом и [пока не работает с нативными JavaScript модулями](https://github.com/yarnpkg/berry/issues/638), которым является SvelteKit и [непрерывно растущее число других пакетов](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77). Вы можете настроить `nodeLinker: 'node-modules'` в вашем файле [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) для отключения pnp, но возможно проще просто  использовать  npm или [pnpm](https://pnpm.io/), который так же быстр и эффективен, но лучше решает проблемы совместимости модулей.