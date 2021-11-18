---
question: Как использовать переменные окружения?
---

Vite использует [dotenv](https://github.com/motdotla/dotenv) для загрузки переменных окружения из файла с именем `.env` или аналогичного. Предпоставляются только переменные с префиксом `VITE_` ([можно установить `envPrefix`, чтобы изменить это](https://vitejs.dev/config/#envprefix)). Сейчас нужно создать экземпляр dotenv самостоятельно, чтобы все переменные среды были открыты в `process.env['YOUR_ENV_VAR']`. [Vite 2.7 предоставит все переменные окружения, доступные на сервере](https://github.com/vitejs/vite/pull/5404).

Подробнее о переменных окружения можно почитать в [документации Vite](https://vitejs.dev/guide/env-and-mode.html#env-files).