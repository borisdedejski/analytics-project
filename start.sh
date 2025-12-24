#!/bin/bash

echo "🚀 Starting Analytics Platform..."
echo ""

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Clean up any existing stopped containers and remove them
echo "🧹 Cleaning up any existing containers..."
docker rm -f analytics-postgres analytics-redis analytics-backend 2>/dev/null || true

# Check for port conflicts
if docker ps --format '{{.Ports}}' | grep -q '0.0.0.0:5432'; then
    echo "⚠️  Port 5432 is already in use by another container."
    echo "    Stopping conflicting containers..."
    # Find and stop containers using port 5432
    docker ps --format '{{.Names}}' | xargs -I {} sh -c 'docker port {} 2>/dev/null | grep -q 5432 && docker stop {} || true' 2>/dev/null || true
fi

if docker ps --format '{{.Ports}}' | grep -q '0.0.0.0:3001'; then
    echo "⚠️  Port 3001 is already in use by another container."
    echo "    Stopping conflicting containers..."
    # Find and stop containers using port 3001
    docker ps --format '{{.Names}}' | xargs -I {} sh -c 'docker port {} 2>/dev/null | grep -q 3001 && docker stop {} || true' 2>/dev/null || true
fi

# Start backend services (PostgreSQL, Redis, Backend API) in Docker
echo "📦 Starting backend services (PostgreSQL, Redis, Backend API)..."
docker-compose -f docker-compose.local.yml up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🌱 Seeding database with sample data..."
docker-compose -f docker-compose.local.yml exec -T backend npm run seed

echo ""
echo "✅ Backend services are ready!"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo ""

# Install frontend dependencies and start dev server
echo "💻 Installing frontend dependencies..."
cd web
npm install

echo ""
echo "🎨 Starting frontend development server..."
echo "🌐 Frontend will be available at: http://localhost:5173"
echo ""
echo "To stop backend services: docker-compose -f docker-compose.local.yml down"
echo ""

npm run dev
