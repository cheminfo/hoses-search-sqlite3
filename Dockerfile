FROM node:22

EXPOSE 40828

RUN mkdir /node

COPY package.json /node/
WORKDIR /node
RUN npm i 

COPY src /node/src

CMD npm start