FROM node:15-alpine

COPY . /app

WORKDIR /app

RUN "npm install @sveltejs/kit"

EXPOSE 3000

CMD [ "node", "index.js" ]