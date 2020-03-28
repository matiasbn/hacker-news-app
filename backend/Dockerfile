FROM node:12-alpine as builder

ENV NODE_ENV=production:docker
ENV MONGO_URI=mongodb://rmongo:27017/
ENV APP_PORT=3001
ENV DATABASE_NAME=hacker-news

WORKDIR /app
COPY package.json /app/package.json
RUN npm install --silent
COPY . /app
RUN npm run build:docker

FROM node:12-alpine

ENV NODE_ENV=production:docker
ENV MONGO_URI=mongodb://rmongo:27017/
ENV APP_PORT=3001
ENV DATABASE_NAME=hacker-news

WORKDIR /app
COPY --from=builder /app/dist /app
COPY package.json /app/package.json
RUN npm install --only=prod
RUN npm install -g pm2

EXPOSE 3001
CMD ["pm2-runtime", "index.js"]