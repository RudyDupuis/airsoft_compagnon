FROM node:22-alpine

WORKDIR /app

RUN apk update && apk add postgresql-client curl

COPY . .
RUN npm install
RUN npm run build

CMD ["node", ".output/server/index.mjs"]