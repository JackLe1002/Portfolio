FROM node:18-alpine

ARG BUILD_ENV=dev
ENV ENV_VAR=$BUILD_ENV

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 5000

CMD [ "node", "index.js" ]
