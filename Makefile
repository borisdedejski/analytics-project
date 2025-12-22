.PHONY: help up down restart logs seed clean dev-backend dev-frontend prisma-generate prisma-migrate prisma-studio prisma-seed get-tenants setup-prisma test-api

help:
	@echo "Analytics Project - Available Commands"
	@echo "---------------------------------------"
	@echo "Full Stack (All in Docker):"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make seed        - Seed database with sample data (legacy)"
	@echo ""
	@echo "Local Development (FE local, BE Docker):"
	@echo "  make dev-backend   - Start backend services only"
	@echo "  make dev-frontend  - Instructions for running frontend locally"
	@echo ""
	@echo "Prisma Commands (New Analytics):"
	@echo "  make setup-prisma    - Complete Prisma setup (generate, migrate, seed)"
	@echo "  make prisma-generate - Generate Prisma client"
	@echo "  make prisma-migrate  - Run Prisma migrations"
	@echo "  make prisma-studio   - Open Prisma Studio (DB GUI)"
	@echo "  make prisma-seed     - Seed with Prisma data"
	@echo "  make get-tenants     - List all tenant IDs"
	@echo "  make test-api        - Test all API endpoints"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean       - Remove all containers and volumes"

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

seed:
	docker-compose exec backend npm run seed

dev-backend:
	@echo "Starting backend services (PostgreSQL, Redis, Backend API)..."
	docker-compose -f docker-compose.local.yml up -d
	@echo ""
	@echo "Backend services started! Run 'make seed' to populate data."
	@echo "Then run frontend: cd web && npm install && npm run dev"

dev-frontend:
	@echo "To run frontend locally:"
	@echo "  cd web"
	@echo "  npm install"
	@echo "  npm run dev"
	@echo ""
	@echo "Make sure backend is running first:"
	@echo "  make dev-backend"

clean:
	docker-compose down -v
	docker-compose -f docker-compose.local.yml down -v
	rm -rf backend/node_modules backend/dist
	rm -rf web/node_modules web/dist

# Prisma commands
prisma-generate:
	@echo "Generating Prisma client..."
	cd backend && npx prisma generate

prisma-migrate:
	@echo "Running Prisma migrations..."
	cd backend && npx prisma migrate dev

prisma-studio:
	@echo "Opening Prisma Studio..."
	cd backend && npx prisma studio

prisma-seed:
	@echo "Seeding database with Prisma..."
	cd backend && npm run seed

get-tenants:
	@echo "Fetching tenant IDs..."
	cd backend && npm run get-tenants

test-api:
	@echo "Testing API endpoints..."
	bash backend/scripts/test-api.sh

# Complete Prisma setup
setup-prisma:
	@echo "🚀 Setting up Prisma analytics..."
	@echo "1️⃣  Generating Prisma client..."
	cd backend && npx prisma generate
	@echo "2️⃣  Running migrations..."
	cd backend && npx prisma migrate dev --name init
	@echo "3️⃣  Seeding database..."
	cd backend && npm run seed
	@echo "4️⃣  Getting tenant IDs..."
	cd backend && npm run get-tenants
	@echo "✅ Setup complete! Use the tenant IDs above for testing."

