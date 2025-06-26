FROM node:20.17.0-alpine

COPY . /src

WORKDIR /src

RUN npm config set fetch-retry-mintimeout 2000
RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod"]
