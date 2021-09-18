---
question: Как использовать переменные окружения?
---

Vite использует [dotenv](https://github.com/motdotla/dotenv) для загрузки переменных окружения из файла с именем `.env` или аналогичного. Предпоставляются только переменные с префиксом `VITE_` ([можно установить `envPrefix`, чтобы изменить это](https://vitejs.dev/config/#envprefix)). Нужно создать экземпляр dotenv самостоятельно, чтобы все переменные среды были открыты в `process.env['YOUR_ENV_VAR']`. Надеемся, что в [будущем](https://github.com/vitejs/vite/issues/3176) сможем использовать все переменные окружения, доступные на сервере.

[Переменные среды нельзя использовать непосредственно в шаблонах Svelte](https://github.com/sveltejs/kit/issues/720) из-за [проблемы в работе плагина определения Vite](https://github.com/vitejs/vite/issues/3176).

Например, можно создать файл `.env` корневой папке проекта с переменной `VITE_*`:

```sh
VITE_MESSAGE="World"
```

Затем вы можете получить доступ к этой переменной в модуле `.js` или` .ts`:

```js
export const MESSAGE = import.meta.env.VITE_MESSAGE;
```

Затем вы можете использовать переменную в своих компонентах из модуля:

```html
<script>
    import { MESSAGE } from `$lib/Env.js`
</script>

<h1>Hello, { MESSAGE }</h1>
```

Вы также можете использовать [параметр Vite `define`](https://vitejs.dev/config/#define):

```js
define: { 'process.env.FOO': 'process.env.FOO' }
```

Подробнее о переменных окружения можно почитать в [документации Vite](https://vitejs.dev/guide/env-and-mode.html#env-files).