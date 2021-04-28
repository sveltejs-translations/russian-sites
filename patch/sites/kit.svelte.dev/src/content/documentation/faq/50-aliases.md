---
question: Как мне настроить подмену пути(aliases)?
---

Обратите внимание, что нужно настроить подмену сразу в двух файлах.

В `svelte.config.cjs` добавьте [`vite.resolve.alias`](https://vitejs.dev/config/#resolve-alias):

```js
// svelte.config.cjs
const path = require('path');
module.exports = {
  kit: {
    vite: {
      resolve: {
        alias: {
          $utils: path.resolve('./src/utils')
        }
      }
    }
  }
};
```

Чтобы VS Code учитывал подмену путей, добавьте аналогичные записи и в `tsconfig.json` (для пользователей TypeScript) или `jsconfig.json` (для JavaScript):

```js
{
  "compilerOptions": {
    "paths": {
      "$utils/*": ["src/utils/*"]
    }
  }
}
```
