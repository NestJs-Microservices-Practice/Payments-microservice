FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

# RUN npx prisma generate <-- esto solo crea el schema de la base de datos, pero no la base de datos en si

EXPOSE 3003


