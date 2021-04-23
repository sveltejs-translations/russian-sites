---
title: package.json
---

### type : "module"

Добавьте `"type": "module"` в `package.json`

### dependencies

Удалите `polka` или `express`, если вы их используете, а также любые промежуточные обработчики, такие как `sirv` или `compression`.

### devDependencies

Удалите `sapper` из `devDependencies` и замените его на `@sveltejs/kit`, `vite` и выбранный вами [адаптер](/docs#адаптеры) (на этапе [конфигурации](#файлы-проекта-конфигурация)).

### scripts

<!-- Все скрипты `sapper` должны быть заменены: -->
Все скрипты, которые ссылаются на `sapper`, должны быть обновлены:

<!-- * `sapper build` или `sapper export` замените на [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) -->
* `sapper build` замените на [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с использованием [адаптера Node](/docs#адаптеры)
* `sapper export` замените на [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с использованием [адаптера Static](/docs#адаптеры)
* `sapper dev` замените на [`svelte-kit dev`](/docs#svelte-kit-cli-svelte-kit-dev)
* `node __sapper__/build` замените на `node build`

<!-- Кроме того, [`svelte-kit start`](/docs#svelte-kit-cli-svelte-kit-start) заменяет любую команду, которая запускает сервер собранный Sapper. -->