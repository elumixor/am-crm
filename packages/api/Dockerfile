# Runtime-only Dockerfile for API
# Assumes monorepo build already ran (dist artifacts present) before docker build.
FROM oven/bun:1
WORKDIR /app

# Expose API port
EXPOSE 3001

# Copy build artifacts
COPY node_modules/.prisma node_modules/.prisma
COPY packages/api/dist dist

# Run compiled entrypoint directly (no package.json script indirection needed)
WORKDIR /app/dist
CMD ["bun", "./index.js"]
