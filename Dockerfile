FROM node:14.19.3-alpine3.16

WORKDIR /app/contract-processor

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

EXPOSE 3001

CMD ["npm", "start"]