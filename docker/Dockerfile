FROM node:15-alpine

COPY . /app

WORKDIR /app

EXPOSE 3000

CMD [ "node", "-r", "esm", "index.js" ]