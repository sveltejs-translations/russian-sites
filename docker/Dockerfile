FROM node:15-alpine

COPY . /app

RUN npm install -g esm

WORKDIR /app

EXPOSE 3000

CMD [ "node", "-r", "esm", "index.js" ]