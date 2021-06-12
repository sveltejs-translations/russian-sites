FROM node:16-alpine

COPY . /app

WORKDIR /app

RUN npm install @sveltejs/adapter-node@next @sveltejs/kit@next

EXPOSE 3000

CMD [ "node", "index.js" ]