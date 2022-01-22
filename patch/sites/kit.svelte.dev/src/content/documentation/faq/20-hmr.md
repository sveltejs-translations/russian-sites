---
question: Как включить HMR в SvelteKit?
---

Горячая перезагрузка модулей (HMR) уже включена в SvelteKit по умолчанию с использованием [svelte-hmr](https://github.com/sveltejs/svelte-hmr). Если вы видели [презентацию Рича на Svelte Summit 2020](https://ru.svelte.dev/blog/whats-the-deal-with-sveltekit), то могли заметить что там показана более продвинутая версия HMR. Это демо было сделано с включенным флагом `preserveLocalState`. Ныне этот флаг по умолчанию выключен, поскольку в редких случаях может приводить к непредсказуемому поведению приложения. Но не волнуйтесь, и без этого флага HMR в SvelteKit работает! Если вам всё же важно сохранять локальное состояние, используйте директивы  `@hmr:keep` или `@hmr:keep-all`, как описано в документации  [svelte-hmr](https://github.com/sveltejs/svelte-hmr).
