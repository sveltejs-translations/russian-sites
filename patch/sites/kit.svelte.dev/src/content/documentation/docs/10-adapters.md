---
title: Адаптеры
---

Прежде чем развернуть готовое приложение SvelteKit на сервере или сервисе, его необходимо адаптировать под то окружение, в котором оно будет работать. Адаптеры - это небольшие плагины, которые принимают созданное приложение в качестве входных и генерируют выходные данные для развертывания. 

По умолчанию проекты настроены на использование `@sveltejs/adapter-auto`, который определяет вашу производственную среду и выбирает соответствующий адаптер, где это возможно. Если ваша платформа (пока) не поддерживается, вам может потребоваться [установить пользовательский адаптер](#adaptery-ustanovka-polzovatelskih-adapterov) или [написать свой](#adaptery-napisanie-polzovatelskih-adapterov).

> См. [adapter-auto README](https://github.com/sveltejs/kit/tree/master/packages/adapter-auto) для получения информации о добавлении поддержки новых сред.

### Поддерживаемые платформы

SvelteKit предлагает ряд официально поддерживаемых адаптеров.

Следующие платформы не требуют дополнительной настройки:

- [Cloudflare Pages](https://developers.cloudflare.com/pages/) через [`adapter-cloudflare`](https://github.com/sveltejs/kit/tree/master/packages/adapter-cloudflare)
- [Netlify] (https://netlify.com) через [`adapter-netlify`](https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify)
- [Vercel](https://vercel.com) через [`adapter-vercel`](https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel)


#### Node.js

Чтобы создать простой Node-сервер, установите пакет `@sveltejs/adapter-node@next` и обновите `svelte.config.js`:

```diff
// svelte.config.js
-import adapter from '@sveltejs/adapter-auto';
+import adapter from '@sveltejs/adapter-node';
```

При этом [svelte-kit build](#svelte-kit-cli-svelte-kit-build) сгенерирует автономное приложение Node в каталоге `build`. Вы можете передать адаптерам параметры, такие как настройка выходного каталога:

```diff
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
-		adapter: adapter()
+		adapter: adapter({ out: 'my-output-directory' })
	}
};
```

#### Статические сайты

Большинство адаптеров будут генерировать статический HTML для любых [предварительно отрисуемых](#ssr-i-javascript-prerender) страниц вашего сайта. В некоторых случаях все ваше приложение может быть предварительно рендеринговым, и в этом случае вы можете использовать `@sveltejs/adapter-static@next` для генерации статического HTML для _всех_ ваших страниц. Полностью статический сайт может быть размещен на самых разных платформах, включая статические хосты, такие как [GitHub Pages](https://pages.github.com/).

```diff
 // svelte.config.js
 -import adapter from '@sveltejs/adapter-auto';
 +import adapter from '@sveltejs/adapter-static';
 ```

Вы также можете использовать `adapter-static` для создания одностраничных приложений (SPA), указав [откатную страницу] (https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode).


### Адаптеры сообщества

Для других платформ существуют дополнительные [адаптеры, предоставляемые сообществом](https://sveltesociety.dev/components#adapters). После установки соответствующего адаптера с помощью менеджера пакетов обновите `svelte.config.js`:

```diff
-import adapter from '@sveltejs/adapter-auto';
+import adapter from 'svelte-adapter-[x]';
```


### Написание своего адаптеров

Мы рекомендуем [брать за основу адаптер](https://github.com/sveltejs/kit/tree/master/packages) на платформу, похожую на вашу, и скопировать его в качестве отправной точки.

Пакеты адаптеров должны реализовывать следующий API, который создает `Адаптер`:

```js
/** @param {AdapterSpecificOptions} options */
export default function (options) {
/** @type {import('@sveltejs/kit').Adapter} */
    return {
        name: 'adapter-package-name',
        async adapt(builder) {
          // adapter implementation
        }
    };
}
```

Типы `Адаптера` и его параметры доступны в [types/config.d.ts](https://github.com/sveltejs/kit/blob/master/packages/kit/types/config.d.ts).

В рамках метода `adapt` есть ряд вещей, которые должен сделать адаптер:

- Очистить каталог сборки
- Вызовать `builder.prerender({ dest })` для предварительной визуализации страниц
- Вывести код, который:
  - Импортирует `App` из `${builder.getServerDirectory()}/app.js`
  - Создаст экземпляр приложения манифестом, сгенерированный с помощью `builder.generateManifest({ relativePath })`
  - Преобразует запросы платформы в [SvelteKit request](#huki-handle), вызовет `render` и преобразует ответ [SvelteKit response](#huki-handle) для платформы
  - Глобально настроит `fetch` для работы на целевой платформе. SvelteKit предоставляет хелпер `@sveltejs/kit/install-fetch` для платформ, которые могут использовать `node-fetch`
- Объединит выходные данные, чтобы избежать необходимости устанавливать зависимости на целевой платформе, если необходимо
- Поместит статические файлы пользователя и сгенерированные JS/CSS в правильное место для целевой платформы

Где возможно, мы рекомендуем поместить вывод адаптера в каталог `build/` с любым промежуточным выходом, размещенным в `'.svelte-kit/' + adapterName`.

> API адаптера может измениться до версии 1.0.
