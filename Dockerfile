FROM replicacia/ruby-base-image:latest AS react_base
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm run build

# production environment
FROM nginx:stable-alpine
WORKDIR /usr/src/app
COPY --from=react_base /usr/src/app/build /usr/share/nginx/html
COPY --from=react_base /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]