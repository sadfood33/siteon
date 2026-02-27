# Dockerfile.frontend
# ============================================
# 🏗️ MULTI-STAGE BUILD FOR FRONTEND
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY public ./public
COPY src ./src

# Build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_NAME
ENV VITE_APP_NAME=$VITE_APP_NAME

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/

# Stage 2: Production with Nginx
FROM nginx:alpine AS production

# Install OpenSSL for health checks
RUN apk add --no-cache openssl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy PWA files
COPY --from=builder /app/public/sw.js /usr/share/nginx/html/sw.js
COPY --from=builder /app/public/manifest.webmanifest /usr/share/nginx/html/manifest.webmanifest

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001 -G nginx-app && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]