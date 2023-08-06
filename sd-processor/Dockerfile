FROM node:18.10.0-alpine3.15 AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD ["node", "./app.js"]
