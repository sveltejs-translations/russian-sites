---
title: Написание адаптера
---

Мы рекомендуем [брать за основу адаптер](https://github.com/sveltejs/kit/tree/master/packages) на платформу, похожую на вашу, и скопировать его в качестве отправной точки.

Пакеты адаптеров должны реализовывать следующий API, который создает `Адаптер`:

```js
/**
* @param {AdapterSpecificOptions} options
*/
export default function (options) {
/** @type {import('@sveltejs/kit').Adapter} */
    return {
        name: 'adapter-package-name',
        async adapt({ utils, config }) {
          // adapter implementation
        }
    };
}
```

Типы `Адаптера` и его параметры доступны в [types/config.d.ts](https://github.com/sveltejs/kit/blob/master/packages/kit/types/config.d.ts).

В рамках метода `adapt` есть ряд вещей, которые должен сделать адаптер:

- Очистить каталог сборки
- Вывести код, который:
  - Вызовет `init`
  - Преобразует запросы платформы в [SvelteKit request](#huki-handle), вызовет `render` и преобразует ответ [SvelteKit response](#huki-handle) для платформы
  - Глобально настроит `fetch` для работы на целевой платформе. SvelteKit предоставляет хелпер `@sveltejs/kit/install-fetch` для платформ, которые могут использовать `node-fetch`
- Объединит выходные данные, чтобы избежать необходимости устанавливать зависимости на целевой платформе, если хотите
- Вызовет `utils.prerender`
- Поместит статические файлы пользователя и сгенерированные JS/CSS в правильное место для целевой платформы

Если возможно, мы рекомендуем поместить вывод адаптера в каталог `build/` с любым промежуточным выходом, размещенным в `'.svelte-kit/' + adapterName`.

> API адаптера может измениться до версии 1.0.