# BUILD
FROM node:12-alpine as build

ADD package.json yarn.lock /app/

WORKDIR /app
RUN yarn install && yarn build

COPY . .

# RUN
FROM node:12-alpine

ADD package.json yarn.lock /app/

WORKDIR /app
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/dist /app/dist
ADD .env.json /app/dist

CMD ["yarn", "start"]
