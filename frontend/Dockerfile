FROM node:12-alpine as builder

WORKDIR /app

COPY package.json /app/package.json

RUN npm install --silent

COPY . /app

RUN npm run build

FROM nginx:1.16.0-alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# FROM node:latest

# WORKDIR /usr/src/front

# COPY package.json ./

# COPY . ./


# #Expose port and start application
# EXPOSE 3000

# CMD ["yarn", "start"]