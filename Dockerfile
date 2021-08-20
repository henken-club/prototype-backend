# whole dependencies
FROM node:16.4.2-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  libssl-dev=1.1.1d-0+deb10u6 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .yarnrc ./
COPY .yarn ./.yarn
RUN yarn install --frozen-lockfile && yarn cache clean

COPY prisma/schema.prisma ./prisma/schema.prisma
RUN yarn prisma generate

# production only dependencies
FROM deps AS deps-production
WORKDIR /app

RUN npm prune --production

# builder
FROM deps AS builder
WORKDIR /app

COPY scripts/protogen ./scripts/protogen
COPY proto ./proto
RUN yarn run protogen

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN yarn run build

# runner
FROM deps-production AS runner
WORKDIR /app

ENV PORT 4000
ENV NODE_ENV production

COPY --from=builder /app/proto ./proto
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
