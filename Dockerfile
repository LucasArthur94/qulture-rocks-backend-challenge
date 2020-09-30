# BUILD
FROM node:12-alpine as build

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install

COPY . .
RUN yarn build

# RUN
FROM node:12-alpine

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/dist /app/dist
ADD .env.json /app/dist

CMD ["yarn", "start"]
