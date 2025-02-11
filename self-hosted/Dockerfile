# FROM node:20-alpine AS node-builder

# RUN apk add --no-cache \
#     bash \
#     curl \
#     tzdata

# WORKDIR /app

# COPY package.json .
# COPY bun.lockb .

# RUN bun install

# COPY . .

# RUN bun build

FROM ghcr.io/get-convex/self-hosted-backend:latest

WORKDIR /convex

RUN npm install -g bun
# COPY --from=node-builder /app/node_modules /app/node_modules
COPY package.json bun.lock ./
RUN bun install

COPY docker/run.sh .
COPY convex convex

ENTRYPOINT ["./run.sh"]

VOLUME /convex/data
VOLUME /convex/convex

EXPOSE 3210
EXPOSE 3211
