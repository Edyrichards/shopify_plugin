FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.js ./vite.config.js
COPY src ./src
COPY client ./client
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=build /usr/src/app/dist ./dist
COPY src ./src
EXPOSE 3000
CMD ["node", "src/server.js"]
