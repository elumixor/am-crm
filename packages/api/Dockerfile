# Runtime-only Dockerfile for API
# Assumes monorepo build already ran (dist artifacts present) before docker build.
FROM oven/bun:1
WORKDIR /app

# Dependency for healthcheck
RUN apt-get update && apt-get install -y curl

# Set-up healthcheck
COPY packages/api/healthcheck .
RUN chmod +x healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD ./healthcheck || exit 1

# Expose API port
EXPOSE 3001

# Copy build artifacts
COPY node_modules/.prisma node_modules/.prisma
COPY packages/api/dist dist

# Run compiled entrypoint directly (no package.json script indirection needed)
WORKDIR /app/dist
CMD ["bun", "./index.js"]
