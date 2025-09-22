# Stage 1 — build with Node 22.4 + pnpm
FROM node:22.4-alpine AS builder

# install pnpm globally
RUN npm i -g pnpm@8.7.5
WORKDIR /app
ENV NODE_ENV=production
ENV PNPM_VERIFY_SIGNATURES=false

# copy only manifest first for better caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm -v
# fetch deps (but don’t install yet)
RUN pnpm install

# copy source code
COPY . .

RUN pnpm build


# Stage 2 — runtime (NGINX)
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf

# copy built assets only
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./conf/nginx.conf /etc/nginx/nginx.conf

# optional: init + remove server tokens
# RUN apk add --no-cache dumb-init && \
#     sed -i 's/# server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf

# security: drop root
# RUN addgroup -S web && adduser -S web -G web
# USER web

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
