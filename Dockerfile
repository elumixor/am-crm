# Use official Bun image
FROM oven/bun:1

WORKDIR /usr/src/app

# Install dependencies first (caches better in Docker)
COPY package.json bun.lock ./
RUN bun install

# Copy source code
COPY . .

EXPOSE 3000

# Run app (production)
CMD ["bun", "start"]