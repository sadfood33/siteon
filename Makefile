# Makefile
# ============================================
# 🛠️ MAKEFILE FOR DOCKER COMMANDS
# ============================================

.PHONY: help dev prod build up down logs migrate seed restart clean

# Default target
help:
	@echo "📋 S.A.D. FOOD Docker Commands"
	@echo ""
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - View logs"
	@echo "  make migrate  - Run database migrations"
	@echo "  make seed     - Seed database"
	@echo "  make restart  - Restart all services"
	@echo "  make clean    - Remove all containers and volumes"

# Development
dev:
	docker-compose -f docker-compose.dev.yml up -d

# Production
prod:
	docker-compose -f docker-compose.prod.yml up -d

# Build
build:
	docker-compose -f docker-compose.prod.yml build --no-cache

# Start
up:
	docker-compose -f docker-compose.prod.yml up -d

# Stop
down:
	docker-compose -f docker-compose.prod.yml down

# Logs
logs:
	docker-compose -f docker-compose.prod.yml logs -f

# Migrate
migrate:
	docker-compose -f docker-compose.prod.yml --profile migrate up migrate

# Seed
seed:
	docker-compose -f docker-compose.prod.yml --profile seed up seed

# Restart
restart:
	docker-compose -f docker-compose.prod.yml restart

# Clean everything
clean:
	docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	docker system prune -f