FROM node:14.17-alpine

WORKDIR /home/node/app

COPY .yarn ./.yarn
COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY ./packages ./packages/
RUN yarn install && yarn build:packages

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

COPY ./services/${SERVICE_NAME} ./services/${SERVICE_NAME}/
RUN yarn install && yarn workspace @monorepo/${SERVICE_NAME}-service run build

CMD node ./services/${SERVICE_NAME}/dist/index.js
