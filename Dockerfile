FROM node:20-alpine3.20 AS build-layer

WORKDIR /opt/wake-bot
RUN apk add --no-cache python3 make g++
COPY ./package.json .
COPY ./package-lock.json .
RUN  npm ci

COPY . .
RUN npm run lint && \
    npm run test && \
    npm run build

RUN npm prune --production

FROM node:20-alpine3.20 AS service-layer

WORKDIR /opt/wake-bot
COPY --from=build-layer /opt/wake-bot/package.json .
COPY --from=build-layer /opt/wake-bot/package-lock.json .
COPY --from=build-layer /opt/wake-bot/LICENSE .
COPY --from=build-layer /opt/wake-bot/README.md .
COPY --from=build-layer /opt/wake-bot/node_modules ./node_modules
COPY --from=build-layer /opt/wake-bot/build ./build

CMD [ "npm", "run", "start" ]
