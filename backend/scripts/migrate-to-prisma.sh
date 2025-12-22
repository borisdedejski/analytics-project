#!/bin/bash

# Migration Script: TypeORM → Prisma
# This script helps you migrate from TypeORM to Prisma step by step

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Migration: TypeORM → Prisma Analytics System         ║${NC}"
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}\n"

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the backend directory${NC}"
    echo -e "${YELLOW}   cd backend && bash scripts/migrate-to-prisma.sh${NC}"
    exit 1
fi

# Step 1: Install Prisma dependencies
echo -e "${BLUE}[Step 1/6]${NC} Installing Prisma dependencies..."
echo -e "${YELLOW}Running: npm install @prisma/client && npm install -D prisma${NC}\n"

if npm list @prisma/client > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Prisma dependencies already installed"
else
    npm install @prisma/client
    npm install -D prisma
    echo -e "${GREEN}✓${NC} Prisma dependencies installed"
fi

# Step 2: Generate Prisma Client
echo -e "\n${BLUE}[Step 2/6]${NC} Generating Prisma Client..."
echo -e "${YELLOW}Running: npx prisma generate${NC}\n"

npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generated"

# Step 3: Check database connection
echo -e "\n${BLUE}[Step 3/6]${NC} Checking database connection..."

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠${NC}  DATABASE_URL not set in environment"
    echo -e "${YELLOW}   Checking .env file...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ .env file not found${NC}"
        echo -e "${YELLOW}   Creating .env file from example...${NC}"
        
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo -e "${GREEN}✓${NC} .env file created"
            echo -e "${YELLOW}⚠${NC}  Please update DATABASE_URL in .env and run this script again"
            exit 0
        else
            echo -e "${RED}❌ .env.example not found${NC}"
            echo -e "${YELLOW}   Please create .env with DATABASE_URL and run again${NC}"
            exit 1
        fi
    fi
fi

# Try to connect
echo -e "${YELLOW}Testing connection...${NC}"
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Database connection successful"
else
    echo -e "${RED}❌ Cannot connect to database${NC}"
    echo -e "${YELLOW}   Please check your DATABASE_URL and ensure PostgreSQL is running${NC}"
    echo -e "${YELLOW}   Run: docker-compose up -d postgres${NC}"
    exit 1
fi

# Step 4: Run Prisma migrations
echo -e "\n${BLUE}[Step 4/6]${NC} Running Prisma migrations..."
echo -e "${YELLOW}This will create the new Prisma tables (Tenant, User, Event, Metric)${NC}"
echo -e "${YELLOW}Your existing TypeORM data will NOT be affected.${NC}\n"

read -p "Continue with migration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Migration cancelled${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Running: npx prisma migrate dev --name init${NC}\n"
npx prisma migrate dev --name init

echo -e "${GREEN}✓${NC} Migrations completed"

# Step 5: Seed the database
echo -e "\n${BLUE}[Step 5/6]${NC} Seeding database with test data..."
echo -e "${YELLOW}This will create:${NC}"
echo -e "  - 10 tenants"
echo -e "  - 200-2000 users per tenant"
echo -e "  - ~1M+ events (last 7 days)"
echo -e "  - ~260K metrics (last 24 hours)\n"

read -p "Proceed with seeding? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Skipping seed...${NC}"
else
    echo -e "\n${YELLOW}Running: npm run seed${NC}"
    echo -e "${YELLOW}This may take 1-2 minutes...${NC}\n"
    npm run seed
    echo -e "${GREEN}✓${NC} Database seeded successfully"
fi

# Step 6: Verify and get tenant IDs
echo -e "\n${BLUE}[Step 6/6]${NC} Fetching tenant IDs for testing..."
echo -e "${YELLOW}Running: npm run get-tenants${NC}\n"

npm run get-tenants

# Final summary
echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              Migration Completed Successfully!            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}✓${NC} Prisma Client generated"
echo -e "${GREEN}✓${NC} Database migrations applied"
echo -e "${GREEN}✓${NC} Test data seeded"
echo -e "${GREEN}✓${NC} Repository migrated from TypeORM to Prisma\n"

echo -e "${YELLOW}📌 Important Notes:${NC}"
echo -e "  1. Your OLD TypeORM endpoints still work"
echo -e "     ${CYAN}GET /api/analytics/summary${NC}"
echo -e "     ${CYAN}GET /api/events${NC}"
echo -e "     ${CYAN}POST /api/events${NC}\n"

echo -e "  2. NEW Prisma endpoints are now available"
echo -e "     ${CYAN}GET /api/tenants${NC}"
echo -e "     ${CYAN}GET /api/tenants/:id/overview${NC}"
echo -e "     ${CYAN}GET /api/tenants/:id/events${NC}"
echo -e "     ${CYAN}GET /api/tenants/:id/metrics${NC}\n"

echo -e "  3. The EventRepository now uses Prisma internally\n"

echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo -e "  1. Start the backend: ${CYAN}npm run dev${NC}"
echo -e "  2. Test the API: ${CYAN}make test-api${NC}"
echo -e "  3. Explore database: ${CYAN}make prisma-studio${NC}"
echo -e "  4. View examples: ${CYAN}cat EXAMPLE_CURLS.md${NC}\n"

echo -e "${YELLOW}📚 Documentation:${NC}"
echo -e "  - ${CYAN}NEW_ANALYTICS_OVERVIEW.md${NC} - Complete overview"
echo -e "  - ${CYAN}QUICKSTART.md${NC} - Quick start guide"
echo -e "  - ${CYAN}ANALYTICS_README.md${NC} - API documentation"
echo -e "  - ${CYAN}EXAMPLE_CURLS.md${NC} - Example commands\n"

# Get first tenant ID for easy copy-paste
FIRST_TENANT=$(npm run get-tenants 2>/dev/null | grep -E '^Tenant' | head -1 | awk '{print $2}')

if [ -n "$FIRST_TENANT" ]; then
    echo -e "${YELLOW}💡 Quick Test:${NC}"
    echo -e "  ${CYAN}export TENANT_ID=\"${FIRST_TENANT}\"${NC}"
    echo -e "  ${CYAN}curl \"http://localhost:3001/api/tenants/\$TENANT_ID/overview?from=\$(date -u -v-7d +%Y-%m-%dT%H:%M:%SZ)&to=\$(date -u +%Y-%m-%dT%H:%M:%SZ)\" | jq${NC}\n"
fi

echo -e "${GREEN}🎉 Migration complete! Your analytics system is ready to use.${NC}\n"

