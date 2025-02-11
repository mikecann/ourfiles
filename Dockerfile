FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
# Self-update npm
RUN npm install

RUN npx update-browserslist-db@latest

# Copy application files
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose necessary ports
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
