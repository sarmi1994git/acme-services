FROM node:12.18

WORKDIR /home/node/app

COPY package*.json ./
COPY . ./

RUN npm install


