FROM node:14

# Create app directory
WORKDIR /chatroulette

COPY . /

WORKDIR /klient

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY ["./web_server/package.json", "./web_server/package-lock.json*", "./klient/"]

RUN npm install

RUN npm run-script build


WORKDIR /web_server

#COPY ["./klient/package.json", "./klient/package-lock.json*", "./klient/"]

RUN npm install


# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

CMD [ "node", "server.js" ]