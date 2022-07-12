# 開発用環境

FROM node:18.5-bullseye AS develop

WORKDIR /usr/local/app


# 本番ビルド環境

FROM node:18.5-bullseye AS prod-builder

WORKDIR /app

COPY . .

RUN yarn install && yarn build


# 本番実行環境

FROM node:18.5-alpine AS prod-runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=prod-builder /app/next.config.js ./
COPY --from=prod-builder /app/public ./public
COPY --from=prod-builder /app/.next/static ./.next/static
COPY --from=prod-builder /app/.next/standalone ./

EXPOSE 3000

CMD [ "node", "server.js" ]
