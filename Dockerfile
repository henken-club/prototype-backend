FROM node:14.16.1 AS builder

WORKDIR /app

COPY package.json yarn.lock  ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY prisma/schema.prisma ./prisma/schema.prisma
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

FROM node:14.16.1-slim

WORKDIR /app

ENV PORT 4000

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl=1.1.0l-1~deb9u3 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
