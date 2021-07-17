FROM node:14.16.1

WORKDIR /app

ADD package.json yarn.lock schema.prisma ./
ADD migrations ./migrations

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["npx", "prisma", "migrate", "deploy"]
