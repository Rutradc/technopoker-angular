FROM node:alpine AS build
WORKDIR /src
RUN npm i -g @angular/cli
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN ng build

FROM nginx:alpine3.22
COPY --from=build /src/dist/technopoker/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
