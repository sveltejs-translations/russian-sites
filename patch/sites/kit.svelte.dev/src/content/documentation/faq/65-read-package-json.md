---
question: Как я могу включить детали из `Package.json в моё приложение?
---

Вы не можете напрямую требовать файлы JSON, поскольку SVELTEKIT ожидает, что [`svelte.config.js`](/docs#konfiguracziya) будет модулем ES. Если вы хотите включить номер версии вашего приложения или другую информацию из `package.json`, вы можете загрузить JSON следующим образом:

```js
const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));
```