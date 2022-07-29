FROM node:16-alpine as base
RUN apk update && apk add bash git python3 make g++ yarn>=1.22.4
WORKDIR /app
COPY package.json tsconfig.json yarn.lock  ./
RUN yarn --frozen-lockfile

FROM base as builder
COPY . .
RUN yarn run build