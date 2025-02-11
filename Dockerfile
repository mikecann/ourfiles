FROM node:20-alpine

# Install npm dependencies
# RUN npm install -g bun

COPY package.json bun.lock ./
RUN npm install

RUN npx update-browserslist-db@latest

# Copy application files
COPY . .

# Expose necessary ports
EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]
