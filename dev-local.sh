#!/bin/bash

echo "🚀 Starting Backend Services (Docker)..."
echo ""

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting backend services (PostgreSQL, Redis, Backend API)..."
docker-compose -f docker-compose.local.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🌱 Seeding database with sample data..."
docker-compose -f docker-compose.local.yml exec -T backend npm run seed

echo ""
echo "✅ Backend services are ready!"
echo ""
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo ""
echo "💻 Now run the frontend locally:"
echo "   cd web"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "To stop backend: docker-compose -f docker-compose.local.yml down"

