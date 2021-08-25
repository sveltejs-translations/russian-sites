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

Если вы предпочитаете импортировать в разметку, попробуйте [svelte-preprocess-import-assets](https://github.com/bluwy/svelte-preprocess-import-assets), и тогда можно будет делать так:

```html
  <img src="$lib/assets/image.png" />
```