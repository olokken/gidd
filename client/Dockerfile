FROM node:lts 

WORKDIR /klient

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start" ]