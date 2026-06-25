FROM node:24 AS build
WORKDIR /src
RUN npm i -g @angular/cli
COPY . .
RUN npm ci
RUN ng build

FROM nginx:alpine3.22
COPY --from=build /src/dist/technopoker/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
