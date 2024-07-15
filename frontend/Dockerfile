# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app

ARG VUE_APP_API_URL_ARG
ENV VUE_APP_API_URL=$VUE_APP_API_URL_ARG

ARG VUE_APP_GOOGLE_CLIENT_ID_ARG
ENV VUE_APP_GOOGLE_CLIENT_ID=$VUE_APP_GOOGLE_CLIENT_ID_ARG

ARG VUE_APP_GOOGLE_REDIRECT_URI_ARG
ENV VUE_APP_GOOGLE_REDIRECT_URI=$VUE_APP_GOOGLE_REDIRECT_URI_ARG

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
