FROM node:18-alpine

ARG VITE_SERVER
ENV VITE_SERVER=$VITE_SERVER

RUN apk add --no-cache gettext # for envsubst

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

RUN npm install -g serve

COPY . /usr/src/app

RUN npx vite build

COPY scripts/startup.sh /usr/src/app/startup.sh

RUN chmod -R 777 /usr/src/app/dist/assets

RUN chmod +x /usr/src/app/startup.sh

EXPOSE 8080

CMD [ "/usr/src/app/startup.sh" ]
