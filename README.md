# Analytics Platform

Full-stack analytics dashboard with real-time data processing.

## Quick Start

### Option 1: Full Stack in Docker

```bash
./start.sh
```

Visit http://localhost:5173 to view the dashboard.

### Option 2: Local Frontend Development

Best for frontend development with hot-reload and debugging:

```bash
# Start backend services in Docker
./dev-local.sh

# In another terminal, run frontend locally
cd web
npm install
npm run dev
```

See [LOCAL_DEV.md](LOCAL_DEV.md) for details.

## Stack

**Backend:** Node.js, Express v5, TypeScript, PostgreSQL, Redis  
**Frontend:** React, TypeScript, Mantine, Zustand, React Query, Zod

## API Endpoints

- `GET /api/analytics/summary` - Analytics summary
- `GET /api/events` - List events
- `POST /api/events` - Create event

## Commands

```bash
# Full Stack
make up      # Start all services
make down    # Stop all services
make logs    # View logs
make seed    # Seed data

# Local Development
make dev-backend   # Start backend only
cd web && npm run dev  # Run frontend locally

# Maintenance
make clean   # Clean everything
```
