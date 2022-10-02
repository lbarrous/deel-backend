FROM node:14

WORKDIR /app/contract-processor

RUN apt-get install python -y

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

EXPOSE 3001

CMD ["npm", "start"]