FROM node:16-alpine

COPY . /app

WORKDIR /app

RUN npx pnpm install svelte @sveltejs/kit@1.0.0-next.108

EXPOSE 3000

CMD [ "node", "index.js" ]