---
title: Эндпоинты
---

В Sapper, 'серверные маршруты', которые теперь называются [эндпоинты](/docs#routing-endpoints), получали объекты `req` и `res` из Node-модуля `http` (или их расширенные версии из фреймворков вроде Polka или Express).

SvelteKit разработан так, чтобы не зависеть от того, где запущено приложение - оно может работать на сервере Node или на бессерверной платформе или в Cloudflare Worker. По этой причине вы больше не взаимодействуете напрямую с `req` и `res`. Ваши эндпоинты необходимо обновить, чтобы они соответствовали новой архитектуре.