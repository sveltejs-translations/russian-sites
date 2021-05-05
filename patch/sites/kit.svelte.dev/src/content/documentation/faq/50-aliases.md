---
question: Как мне настроить подмену пути(aliases)?
---

Сначала её нужно добавить в конфигурацию Vite. В файле `svelte.config.js` добавьте [`vite.resolve.alias`](https://vitejs.dev/config/#resolve-alias):

В `svelte.config.cjs` добавьте [`vite.resolve.alias`](https://vitejs.dev/config/#resolve-alias):

```js
// svelte.config.js
import path from 'path';

export default {
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

Затем, чтобы TypeScript тоже учитывал подмену путей, добавьте аналогичные записи и в `tsconfig.json` (для пользователей TypeScript) или `jsconfig.json`:

```js
{
  "compilerOptions": {
    "paths": {
      "$utils/*": ["src/utils/*"]
    }
  }
}
```
