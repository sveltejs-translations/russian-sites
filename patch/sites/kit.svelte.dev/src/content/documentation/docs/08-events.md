---
title: События
---

SvelteKit пробрасывает [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) на объект `window` когда:

* `sveltekit:start` — приложение гидрируется
* `sveltekit:navigation-start` — навигация началась
* `sveltekit:navigation-end` — навигация закончилась

Возможно, вам не понадобится их использовать, но они могут быть полезны, например, в контексте интеграционных тестов.