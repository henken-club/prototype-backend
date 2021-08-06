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

RUN apt-get update && apt-get install -y --no-install-recommends \
  libssl-dev=1.1.1d-0+deb10u6 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
