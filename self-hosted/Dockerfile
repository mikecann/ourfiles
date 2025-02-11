FROM ghcr.io/get-convex/self-hosted-backend:latest

WORKDIR /convex

RUN apt-get update && apt-get install -y bash curl
RUN npm install -g bun

COPY package.json bun.lock ./
RUN bun install

COPY self-hosted/run.sh .
COPY convex convex

ENTRYPOINT ["/bin/bash", "./run.sh"]

VOLUME /convex/data
VOLUME /convex/convex

EXPOSE 3210
EXPOSE 3211
