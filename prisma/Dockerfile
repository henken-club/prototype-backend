FROM node:14.16.1

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./
COPY migrations ./migrations

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["npx", "prisma", "migrate", "deploy"]
