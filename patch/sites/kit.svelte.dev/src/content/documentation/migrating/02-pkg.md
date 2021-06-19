---
title: package.json
---

### type : "module"

Добавьте `"type": "module"` в `package.json`

### dependencies

Удалите `polka` или `express`, если вы их используете, а также любые промежуточные обработчики, такие как `sirv` или `compression`.

### devDependencies

Удалите `sapper` из `devDependencies` и замените его на `@sveltejs/kit` и выбранный вами [адаптер](/docs#adaptery) (на этапе [конфигурации](#fajly-proekta-konfiguracziya)).

### scripts

Все скрипты, которые ссылаются на `sapper`, должны быть обновлены:

- `sapper build` замените на [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с использованием [адаптера Node](/docs#adaptery)
- `sapper export` замените на [`svelte-kit build`](/docs#svelte-kit-cli-svelte-kit-build) с использованием [адаптера Static](/docs#adaptery)
- `sapper dev` замените на [`svelte-kit dev`](/docs#svelte-kit-cli-svelte-kit-dev)
- `node __sapper__/build` замените на `node build`