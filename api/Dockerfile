FROM node:16.18.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
