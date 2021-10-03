FROM node:12-alpine

ADD build /app/build
ADD package.json /app
ADD server /app/server

RUN cd /app; npm install

ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080

WORKDIR "/app"
CMD [ "npm", "start" ]