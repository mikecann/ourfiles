FROM oven/bun:1 as builder

WORKDIR /app

ARG VITE_CONVEX_URL
ARG VITE_CONVEX_DASHBOARD_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV VITE_CONVEX_DASHBOARD_URL=$VITE_CONVEX_DASHBOARD_URL

COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy application files
COPY . .
RUN bun run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose necessary ports
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
