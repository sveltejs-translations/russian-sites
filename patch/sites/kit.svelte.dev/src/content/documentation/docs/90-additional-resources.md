---
title: Дополнительные ресурсы
---

### FAQ

Пожалуйста, просмотрите [SvelteKit FAQ](/faq), чтобы найти решения типичных проблем, а также полезные советы и рекомендации.

[Svelte FAQ](https://svelte.dev/faq) и [`vite-plugin-svelte` FAQ](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md) также могут быть полезны для вопросов, исходящих из этих библиотек.

### Примеры

Мы написали и опубликовали несколько различных сайтов на Sveltekit в качестве примеров:

 - [Папка с примерами](https://github.com/sveltejs/kit/tree/master/examples) на GitHub включая клон HackerNews
 - [`sveltejs/realworld`](https://github.com/sveltejs/realworld) пример блога
 - [`sveltejs/sites`](https://github.com/sveltejs/sites) содержит код для этого сайта и [svelte.dev](https//svelte.dev/)


### Интеграция

[`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess) автоматически преобразует код в шаблонах Svelte, чтобы обеспечить поддержку TypeScript, PostCSS, Scss/Sass, Less и многих других технологий (Кроме CoffeeScript, который [не поддерживается](https://github.com/sveltejs/kit/issues/2920#issuecomment-996469815) SvelteKit). Первым шагом настройки является добавление `svelte-preprocess` в ваш [`svelte.config.js`](#konfiguracziya). Он предоставляется шаблоном, если вы используете TypeScript, в то время как пользователям JavaScript нужно будет добавить его. После этого вам часто нужно будет только установить соответствующую библиотеку, такую как `npm install -D sass` или `npm install -D less`. Дополнительную информацию см. в документации [`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess).

[Svelte Adders](https://sveltesociety.dev/templates#adders) позволяют настроить множество различных сложных интеграций, таких как Tailwind, PostCSS, Firebase, GraphQL, mdsvex и многое другое, с помощью одной команды. Полный список шаблонов, компонентов и инструментов, доступных для использования с Svelte и SvelteKit, см. [sveltesociety.dev](https://sveltesociety.dev/).

Часто задаваемые вопросы о SvelteKit также содержат [раздел об интеграции](/faq#integrations), который может быть полезен, если вы столкнетесь с какими-либо проблемами.


### Поддержка

Вы можете обратиться за помощью в [Discord](https://svelte.dev/chat) и [StackOverflow](https://stackoverflow.com/questions/tagged/sveltekit). Пожалуйста, сначала поищите информацию, касающуюся вашей проблемы, в FAQ, Google или другой поисковой системе, в системе отслеживания проблем и истории чата Discord, чтобы уважать время других. Это поможет сообществу развиваться быстрее, потому, что людей, задающих вопросы, гораздо больше, чем отвечающих на них.
