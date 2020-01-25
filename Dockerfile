#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm nodejs-legacy
#RUN git clone git://github.com/DuoSoftware/DVP-Interactions.git /usr/local/src/interactions
#RUN cd /usr/local/src/interactions; npm install
#CMD ["nodejs", "/usr/local/src/interactions/app.js"]

#EXPOSE 8872

FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-Interactions.git /usr/local/src/interactions
RUN cd /usr/local/src/interactions;
WORKDIR /usr/local/src/interactions
RUN npm install
EXPOSE 8873
CMD [ "node", "/usr/local/src/interactions/app.js" ]

FROM node:10-alpine
WORKDIR /usr/local/src/interactions
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8873
CMD [ "node", "app.js" ]


