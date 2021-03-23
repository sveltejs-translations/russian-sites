---
title: События
---

SvelteKit запускает [пользовательские события](https://learn.javascript.ru/dispatch-events) на объекте `window` когда:

* `sveltekit:start` — приложение закончило гидрацию
* `sveltekit:navigation-start` — навигация началась
* `sveltekit:navigation-end` — навигация закончилась

Возможно, вам не понадобится их использовать, но они могут быть полезны, например, в интеграционных тестах.