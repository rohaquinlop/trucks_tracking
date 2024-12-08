FROM node:23-alpine AS build-stage

RUN mkdir -p /usr/src/app/frontend

COPY . /usr/src/app/frontend

WORKDIR /usr/src/app/frontend

RUN yarn

ENV PATH /usr/src/app/frontend/node_modules/.bin:$PATH

# uncomment this line to run in development mode
# RUN yarn start

# comment the following lines to run in development mode

RUN yarn build

FROM nginx:latest AS production-stage

WORKDIR /usr/share/nginx/html

COPY --from=build-stage /usr/src/app/frontend/build .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]