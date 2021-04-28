---
question: Как использовать X вместе со SvelteKit?
---

### Как настроить библиотеку X?

Посмотрите репозиторий [sveltejs/integrations](https://github.com/sveltejs/integrations#sveltekit), чтобы найти примеры интеграции со множеством популярных библиотек типа Tailwind, PostCSS, Firebase, GraphQL, mdsvex и т.д.

<!-- ### Как использовать Babel, CoffeeScript, Less, PostCSS / SugarSS, Pug, scss / sass, Stylus, TypeScript, `global` стили или заменить? -->


### Как использовать `svelte-preprocess`?

<!-- SvelteKit предоставляет [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) по умолчанию . Для многих из этих инструментов вам нужно только установить соответствующую библиотеку, например `npm install -D sass` или `npm install -D less`. Смотрите [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) для получения полной информации. -->

<!-- Добавление [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) в [`svelte.config.cjs`](/docs#конфигурация) — это первый шаг. Для многих инструментов, перечисленных выше, нужно только установить соответствующую библиотеку, такую ​​как `npm install -D sass` или `npm install -D less`. Смотрите подробную информацию в документации по svelte-preprocess. -->

`svelte-preprocess` обеспечивает поддержку Babel, CoffeeScript, Less, PostCSS/SugarSS, Pug, scss/sass, Stylus, TypeScript, стилей `global` и replace. Добавление [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) в ваш ([`svelte.config.cjs`](/docs#конфигурация)) - это первый шаг. Он предоставляется шаблоном, если вы используете TypeScript. Пользователям JavaScript нужно будет добавить его. Для многих инструментов, перечисленных выше, вам потребуется только установить соответствующую библиотеку, такую ​​как `npm install -D sass` или` npm install -D less`. См. Документацию [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) для получения полной информации.

<!-- Также смотрите настроки этих и подобных библиотек в [примерах выше](#как-использовать-x-вместе-со-sveltekit-как-настроить-библиотеку-x). -->
Также см. [sveltejs/integration](https://github.com/sveltejs/integrations#sveltekit), где приведены примеры настройки подобных библиотек.


### Как использовать Firebase?

Используйте SDK v9, с модульным подходом SDK, который в настоящее время на стадии бета-тестирования. Старые версии очень трудно заставить работать, особенно с SSR, они очень сильно уыеличивают размер бандла клиента.


### Как использовать клиентскую библиотеку, которая зависит от `document` или `window`?

Vite попытается обработать все импортированные библиотеки и может потерпеть неудачу при обнаружении библиотеки, несовместимой с SSR. [В настоящее время это происходит, даже когда SSR отключен.](https://github.com/sveltejs/kit/issues/754).

Если вам нужен доступ к переменным `document` или `window` или он должен запускаться только на стороне клиента, вы можете обернуть его проверкой `browser`:

```js
import { browser } from '$app/env';

if (browser) {
// client-only code here
}
```

Также можно запустить код в `onMount` если хотите запустить его после того, как компонент был впервые отрисован в DOM:

```html
<script>
import { onMount } from 'svelte';
// import { browser } from '$app/env';

let awkward;

onMount(async () => {
  // if (browser) {
  //   const module = await import('some-browser-only-library');
  //   awkward = module.default;
  // }
  const module = await import('some-browser-only-library');
  awkward = module.default;
});
</script>
```

### Как настроить базу данных?

Поместите код запросов к базе данных в [эндпоинты](/docs#маршруты-эндпоинты) - не обращайтесь к БД в файлах .svelte. Вы можете создать файл `db.js` или аналогичный, который будет устанавливать соединение с БД и предоставлять к ней доступ всему приложению. Импортируйте в файл `hooks.js` метод устанавливающий соединение с базой и любой другой код, который должен выполняться единоразово при старте приложения, а в эндпоинты импортируйте функции для выполнения запросов в БД.


<!-- ### Как использовать Axios?

Скорее всего он вам не нужен. Обычно мы рекомендуем использовать `fetch`. При необходимости, лучше использовать не Axios, а его полную замену написанную на ES модулях – `redaxios`, [пока в Axios не будет поддержки ES модулей](https://github.com/axios/axios/issues/1879). В крайнем случае, при желании использовать сам Axios, попробуйте поместить его в `optimizeDeps.include`. -->


### Поддерживается ли Yarn 2?

Вроде того. Функция Plug'n'Play (или 'pnp') сломана – она резолвит Node-модули нестандартным способом и [пока не работает с нативными JavaScript модулями](https://github.com/yarnpkg/berry/issues/638), которым является SvelteKit и [непрерывно растущее число других пакетов](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77). Вы можете настроить `nodeLinker: 'node-modules'` в вашем файле [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) для отключения pnp, но возможно проще просто  использовать  npm или [pnpm](https://pnpm.io/), который так же быстр и эффективен, но лучше решает проблемы совместимости модулей.