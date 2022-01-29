---
title: Конфигурация
---

Конфигурация проекта находится в файле `svelte.config.js`. Все значения не обязательны. Полный список параметров со значениями по умолчанию показан здесь:

```js
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// параметры для svelte.compile (https://svelte.dev/docs#svelte_compile)
	compilerOptions: null,

	// массив расширений, которые будут считаться компонентами Svelte
	extensions: ['.svelte'],

	kit: {
		adapter: null,
		amp: false,
		appDir: '_app',
		csp: {
 			mode: 'auto',
 			directives: {
 				'default-src': undefined
 				// ...
 			}
 		},
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			template: 'src/app.html'
		},
		floc: false,
		hydrate: true,
		inlineStyleThreshold: 0,
		methodOverride: {
 			parameter: '_method',
 			allowed: []
 		},
		package: {
 			dir: 'package',
 			// excludes all .d.ts and files starting with _ as the name
 			exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
 			files: () => true,
 			emitTypes: true
 		},
		paths: {
			assets: '',
			base: ''
		},
		prerender: {
			concurrency: 1,
			crawl: true,
			enabled: true,
			subfolders: true,
			entries: ['*'],
 			onError: 'fail'
		},
		router: true,
		routes: (filepath) => !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath),
		serviceWorker: {
			register: true,
 			files: (filepath) => !/\.DS_STORE/.test(filepath)
 		},
		target: null,
		trailingSlash: 'never',
		vite: () => ({})
	},

	// SvelteKit использует vite-plugin-svelte. Его варианты можно предоставить прямо здесь.
	// Смотрите доступные варианты по адресу https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md

	// параметры для svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: null
};

export default config;
```

### adapter

Требуется при запуске `svelte-kit build` и определяет, как преобразуется вывод для разных платформ. См. [Адаптеры](#adaptery).

### amp

Включить режим [AMP](#amp).

### appDir

Директория относительно `paths.assets` в которой будут находиться скомпилированные JS/CSS файлы и импортированные статические ресурсы. Имена файлов в этой директории будут содержать хеши на основе их содержимого, то есть эти файлы можно кэшировать на неопределённый срок. Не должно начинаться или заканчиваться на `/`.

### csp

Объект, содержащий ноль или более из следующих значений:

- `mode` - 'hash', 'nonce' или 'auto'
- `directives` — объект пар `[directive]: value[]`.

[Content Security Policy] (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) конфигурация. CSP помогает защитить ваших пользователей от межсайтовых атак по сценариям (XSS), ограничивая места, из которых могут загружаться ресурсы. Например, такая конфигурация...

```js
 {
 	directives: {
 		'script-src': ['self']
 	}
 }
 ```

...позволит предотвратить загрузку скриптов с внешних сайтов. SvelteKit дополнит указанные директивы nonces или hashes (в зависимости от `mode`) для любых встроенных стилей и скриптов, которые он генерирует.

При предварительном рендеринге страниц заголовок CSP добавляется с помощью тега `<meta http-equiv>` (обратите внимание, что в этом случае директивы `frame-ancestors`, `report-uri` и `sandbox` будут игнорироваться).

> Когда `mode: 'auto'`, SvelteKit будет использовать nonces для динамически визуализированных страниц и hashes для предварительно отрендеренных страниц. Использование nonces с предварительно отрендеренными страницами небезопасно и, следовательно, запретно.

### files

Объект, содержащий следующие строковые параметры(все опциональны):

- `assets` — место для размещения статических файлов, которые должны иметь стабильные URL-адреса и не подвергаться обработке, например `favicon.ico` и `manifest.json`
- `hooks` — путь к файлу хуков (см. [Хуки](#huki))
- `lib` — внутренняя библиотека вашего приложения, доступная во всей кодовой базе как `$lib`
- `routes` — файлы, которые определяют структуру вашего приложения ([Маршруты](#marshruty))
- `serviceWorker` — точка входа [сервис-воркера](#servis-vorkery)
- `template` — расположение шаблона для HTML-ответов сервера


### floc

Google [FLoC](https://github.com/WICG/floc) — это технология таргетированной рекламы, которую [Electronic Frontier Foundation](https://www.eff.org/) сочла [вредной](https://www.eff.org/deeplinks/2021/03/googles-floc-terrible-idea) для конфиденциальности пользователей. [Браузеры, отличные от Chrome](https://www.theverge.com/2021/4/16/22387492/google-floc-ad-tech-privacy-browsers-brave-vivaldi-edge-mozilla-chrome-safari) отказались её реализовать.

SvelteKit по умолчанию отключает использование FLoC в вашем приложении, также как это делают другие сервисы, например [GitHub Pages](https://github.blog/changelog/2021-04-27-github-pages-permissions-policy-interest-cohort-header-added-to-all-pages-sites/ ). Если для параметра `floc` не установлено значение `true`, к ответу сервера будет добавлен такой заголовок:

``` 
Permissions-Policy: Interest-cohort = () 
```

> Это может применяться только при серверном рендеринге — заголовки для предварительно отрисованных страниц (например, созданных с помощью [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static)) определяются платформой хостинга.


### hydrate

Указывает, нужно ли гидрировать [гидрировать](#parametry-straniczy-hydrate) полученный с сервера HTML клиентской частью приложения. Устанавливайте этот параметр в `false` только в исключительных случаях.

### inlineStyleThreshold

Инлайн CSS внутри блока `<style>` в `<head>` HTML. Максимальный размер CSS-файла, подлежащего инлайну. Все CSS-файлы, необходимые для страницы, но меньшие этого значения, объединяются и инлайнятся в блок `<style>`.

> Это приводит к меньшему количеству первоначальных запросов и может улучшить [First Contentful Paint](https://web.dev/first-contentful-paint). Но генерирует больше HTML и снижает эффективность кэшей браузера.

### methodOverride

См. [HTTP методы](#marshruty-endpointy-http-metody). Объект, содержащий ноль или более из следующего:

- `parameter` - имя параметра запроса, используемое для передачи предполагаемого значения метода
- `allowed` - массив методов HTTP, которые могут быть использованы при переопределении исходного метода запроса

### package

Опции, связанные с [созданием пакетов](#sozdanie-paketov).

- `dir` - выходной каталог
- `emitTypes` - по умолчанию `svelte-kit package` автоматически сгенерирует типы для вашего пакета в виде файлов `.d.ts`. Хотя генерация типов настраивается, мы считаем, что для качества экосистемы всегда надо генерировать типы. Пожалуйста, убедитесь, что у вас есть веская причина установливать значение `false` (например, если вместо этого вы хотите предоставить рукописные определения типов).
- `exports` - функция типа `(filepath: string) => boolean`. Когда возвращает `true`, путь к файлу будет включён в поле `exports:` в `package.json`. Любые сущуствующие значения в исходном `package.json` будут объеденены с  `exports` полями в приоритете
 - `files` - функция типа `(filepath: string) => boolean`. Когда возвращает  `true`, файлы будут обработаны и скопированы в папку опеределенную в `dir`

 Для удобного сравнения `filepath`, можно использовать дополнительные библиотеки в полях `exports` и `files`:

 ```js
 // svelte.config.js
 import mm from 'micromatch';

 export default {
 	kit: {
 		package: {
 			exports: (filepath) => {
 				if (filepath.endsWith('.d.ts')) return false;
 				return mm.isMatch(filepath, ['!**/_*', '!**/internal/**'])
 			},
 			files: mm.matcher('!**/build.*')
 		}
 	}
 };
 ```

### paths

Объект, содержащий следующие строковые параметры(все опциональны):

- `assets` — абсолютный путь, откуда будут загружаться статические файлы вашего приложения. Это может быть полезно в случае, когда эти файлы находятся в каком-либо внешнем хранилище.
- `base` — путь относительно корня, который должен начинаться, но не заканчиваться на `/` (например, `/base-path`). Указывает, где будет находиться приложение и позволяет запускать приложение из поддиректории основного домена.


### prerender

См. [Пререндер](#parametry-straniczy-prerender). Объект, содержащий следующие параметры(все опциональны):

- `concurrency` - сколько страниц может быть предварительно отрендерено одновременно. JS однопоточный, но в случаях, когда производительность предварительного рендеринга привязана к сети (например, загрузка контента с удаленной CMS), это может ускорить процесс, обрабатывая другие задачи во время ожидания ответа сети.
- `crawl` — определяет, должен ли SvelteKit находить страницы для предварительной отрисовки, переходя по ссылкам с исходных страниц
- `enabled` — установите в `false`, чтобы полностью отключить пререндер
- `entries` — массив страниц для предварительной отрисовки или начала сканирования (при `crawl: true`). Строка `*` включает все нединамические маршруты (т.е. страницы без `[parameters]`)
- `subfolders` - установите значение `false`, чтобы отключить вложенные папки для маршрутов: вместо `about/index.html` отрисовать `about.html`
- `onError`

   - `'fail'` — (по умолчанию) прерывает сборку при обнаружении ошибки маршрутизации при переходе по ссылке
   - `'continue'` — позволяет продолжить сборку, несмотря на ошибки маршрутизации
   - `function` — пользовательский обработчик ошибок, позволяющий регистрировать, `throw` и ошибки сборки или предпринимать другие действия по вашему выбору на основе деталей обхода содержимого

     ```ts
	 import static from '@sveltejs/adapter-static';

     /** @type {import('@sveltejs/kit').PrerenderErrorHandler} */

     const handleError = ({ status, path, referrer, referenceType }) => {
     	if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
     	console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
     };

     export default {
     	kit: {
     		adapter: static(),
     		target: '#svelte',
     		prerender: {
     			onError: handleError
     		}
     	}
     };
     ```

### router

Включает или отключает клиентский [роутер](#parametry-straniczy-router) в приложении.

### routes

Функция `(filepath: string) => boolean`, которая определяет, какие файлы создают маршруты, а какие рассматриваются как [частные модули](#routing-private-modules).

### serviceWorker

Объект, содержащий ноль или более из следующих значений:

- `register` - если установлено значение `false`, отключит автоматическую регистрацию сервис-воркера
- `files` - функция типа `(filepath: string) => boolean`. Когда возвращает `true`, включенные файлы будут доступны в `$service-worker.files`, или исключены если `false`.

### target

Задаёт элемент, в который будет смонтировано приложение. Это должен быть DOM-селектор, который идентифицирует элемент, существующий в вашем файле шаблона. Если значения не указано, приложение будет смонтировано в `document.body`.

### trailingSlash

 Следует ли удалять, добавлять или игнорировать завершающие слэши при разрешении URL-адресов в маршруты.

 - `"never"` - перенаправит `/x/` на `/x`
 - `"always"` - перенаправит `/x` на `/x/`
 - `"ignore"`- не добавлять/удалять завершающие слэши автоматически. `/x` и `/x/` будут рассматриваться эквивалентно

> Игнорировать завершающие слэши не рекомендуется — семантика относительных путей в двух случаях различается (`./y` от `/x` равно `/y`, а от `/x/` это `/x/y`) , а также `/x` и `/x/` рассматриваются как отдельные URL-адреса, что вредно для SEO. Если вы используете эту опцию, убедитесь, что вы реализовали логику для условного добавления или удаления завершающих слэшей из `request.path` внутри вашей функции [`handle`](/docs#huki-handle).

### vite

[Объект конфигурации Vite](https://vitejs.dev/config), или функция, которая его возвращает. Вы можете передать [плагины Vite и Rollup](https://github.com/vitejs/awesome-vite#plugins) через [параметр `plugins`](https://vitejs.dev/config/#plugins), чтобы настроить свою сборку продвинутыми способами, такими как поддержка оптимизации изображений, Tauri, WASM, Workbox, и другими. SvelteKit помешает вам установить определенные параметры, связанные со сборкой, так как это зависит от определенных значений конфигурации.