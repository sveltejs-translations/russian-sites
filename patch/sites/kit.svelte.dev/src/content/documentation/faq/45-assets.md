---
question: Как мне хэшировать имена статических файлов для кеширования?
---

Внешние файлы можно обработать с помощью Vite, импортировав их, как показано ниже:

```html
<script>
  import imageSrc from '$lib/assets/image.png';
</script>

<img src={imageSrc} />
```
