# ----- Build Stage -----
FROM node:lts-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package and configuration
COPY package.json pnpm-lock.yaml tsconfig.json ./

# Copy source code
COPY src ./src

# Install dependencies and build
RUN pnpm install --frozen-lockfile && pnpm run build

# ----- Production Stage -----
FROM node:lts-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built artifacts
COPY --from=builder /app/build ./build

# Copy package.json and lockfile for production install
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Expose port 3000 (internal container port)
EXPOSE 3000

# Add health check for HTTP mode
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD if [ "$MCP_TRANSPORT" = "http" ] || [ "$MCP_TRANSPORT" = "sse" ]; then \
        wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1; \
      else \
        exit 0; \
      fi

# Default command supports both stdio and HTTP modes
CMD ["node", "build/index.js"]
