FROM oven/bun:1
WORKDIR /app

# Expose API port
EXPOSE 3001

# Install OpenSSL (for Prisma)
RUN apt-get update -y && apt-get install -y openssl curl \
  && rm -rf /var/lib/apt/lists/*

# Copy the whole monorepo
COPY . .
RUN bun install --frozen-lockfile

# Generate Prisma client in the container
RUN bunx prisma generate --schema packages/db/prisma/schema.prisma

RUN cd packages/api && bun run build && cd ../..

# Run compiled entrypoint directly (no package.json script indirection needed)
CMD ["bun", "./packages/api/dist/index.js"]
