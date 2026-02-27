# scripts/deploy.sh
# ============================================
# 🚀 DEPLOYMENT SCRIPT
# ============================================

#!/bin/bash
set -e

echo "🚀 Starting S.A.D. FOOD Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.production exists
if [ ! -f .env.production ]; then
    log_error ".env.production file not found!"
    log_info "Copy .env.example to .env.production and fill in the values"
    exit 1
fi

# Stop existing containers
log_info "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build images
log_info "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Run database migrations
log_info "Running database migrations..."
docker-compose -f docker-compose.prod.yml --profile migrate up migrate

# Seed database (optional)
log_warn "Seeding database..."
docker-compose -f docker-compose.prod.yml --profile seed up seed

# Start all services
log_info "Starting all services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
log_info "Waiting for services to be healthy..."
sleep 30

# Check health
log_info "Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Show logs
log_info "Showing last 20 lines of logs..."
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
log_info "✅ Deployment completed successfully!"
log_info "📍 Frontend: http://localhost:80"
log_info "📍 Backend: http://localhost:3000"
log_info "📍 Health Check: http://localhost:80/api/health"