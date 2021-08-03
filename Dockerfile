FROM node:16.4.2 AS builder

WORKDIR /app

COPY package.json yarn.lock  ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY prisma/schema.prisma ./prisma/schema.prisma
RUN yarn prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN yarn run build

FROM node:16.4.2-slim

WORKDIR /app

ENV PORT 4000
ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
