FROM node:12.16.3-alpine as build
COPY .ebextensions ./.ebextensions
# working directory
WORKDIR /usr/src/app

# global environment setup : yarn + dependencies needed to support node-gyp
RUN apk --no-cache --virtual add \
    python \
    make \
    g++ \
    yarn

# set env variable for CI
ENV CI=true

# copy root dependency files and configs needed for install
COPY package.json yarn.lock babel.config.js magento-compatibility.js ./
COPY scripts/monorepo-introduction.js ./scripts/monorepo-introduction.js
COPY .ebextensions ./.ebextensions

# copy over the packages
COPY packages ./packages

# copy configuration env file from host file system to venia-concept .env for build
COPY ./docker/.env.docker.prod ./packages/venia-concept/.env

# install dependencies with yarn
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
# build the app
RUN yarn run build

# MULTI-STAGE BUILD
FROM node:12.16.3-alpine
COPY .ebextensions ./.ebextensions
# working directory
WORKDIR /usr/src/app
# node:alpine comes with a configured user and group
RUN chown -R node:node /usr/src/app
# copy build from previous stage
COPY --from=build /usr/src/app .
USER root
EXPOSE 8080
ENV NODE_ENV=production
# command to run application
CMD [ "yarn", "stage:venia" ]
