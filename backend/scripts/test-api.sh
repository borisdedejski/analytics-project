#!/bin/bash

# Analytics API Test Script
# Tests all new Prisma-based endpoints

set -e

API_URL="${API_URL:-http://localhost:3001}"
TENANT_ID="${TENANT_ID:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Analytics API Test Suite${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: jq is not installed. Install it for better output formatting.${NC}"
    echo -e "${YELLOW}   macOS: brew install jq${NC}"
    echo -e "${YELLOW}   Linux: apt-get install jq${NC}\n"
fi

# Test 1: Health Check
echo -e "${BLUE}[1/7]${NC} Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "${API_URL}/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✓${NC} Health check passed"
else
    echo -e "${RED}✗${NC} Health check failed"
    exit 1
fi

# Test 2: List Tenants
echo -e "\n${BLUE}[2/7]${NC} Testing list tenants endpoint..."
TENANTS_RESPONSE=$(curl -s "${API_URL}/api/tenants")
TENANT_COUNT=$(echo "$TENANTS_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

if [ "$TENANT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Found $TENANT_COUNT tenants"
    
    # Auto-select first tenant if not provided
    if [ -z "$TENANT_ID" ]; then
        TENANT_ID=$(echo "$TENANTS_RESPONSE" | jq -r '.[0].id' 2>/dev/null)
        echo -e "${YELLOW}ℹ${NC}  Auto-selected tenant: $TENANT_ID"
    fi
else
    echo -e "${RED}✗${NC} No tenants found. Please run seed first: npm run seed"
    exit 1
fi

# Test 3: Get Tenant Details
echo -e "\n${BLUE}[3/7]${NC} Testing get tenant details..."
TENANT_DETAIL=$(curl -s "${API_URL}/api/tenants/${TENANT_ID}")
TENANT_NAME=$(echo "$TENANT_DETAIL" | jq -r '.name' 2>/dev/null)

if [ -n "$TENANT_NAME" ] && [ "$TENANT_NAME" != "null" ]; then
    echo -e "${GREEN}✓${NC} Tenant details retrieved: $TENANT_NAME"
else
    echo -e "${RED}✗${NC} Failed to get tenant details"
    exit 1
fi

# Calculate date ranges
TO_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
FROM_DATE_7D=$(date -u -v-7d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%SZ)
FROM_DATE_24H=$(date -u -v-24H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)
FROM_DATE_1H=$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)

# Test 4: Tenant Overview
echo -e "\n${BLUE}[4/7]${NC} Testing tenant overview endpoint (last 7 days)..."
OVERVIEW_RESPONSE=$(curl -s "${API_URL}/api/tenants/${TENANT_ID}/overview?from=${FROM_DATE_7D}&to=${TO_DATE}")
ACTIVE_USERS=$(echo "$OVERVIEW_RESPONSE" | jq '.activeUsers' 2>/dev/null)

if [ -n "$ACTIVE_USERS" ] && [ "$ACTIVE_USERS" != "null" ]; then
    echo -e "${GREEN}✓${NC} Overview retrieved successfully"
    echo -e "   Active Users: $ACTIVE_USERS"
    
    EVENTS_PER_MIN=$(echo "$OVERVIEW_RESPONSE" | jq '.eventsPerMinute | length' 2>/dev/null)
    TOP_EVENTS=$(echo "$OVERVIEW_RESPONSE" | jq '.topEventTypes | length' 2>/dev/null)
    LATENCY_P95=$(echo "$OVERVIEW_RESPONSE" | jq '.dashboardLoadTimeP95' 2>/dev/null)
    ERROR_RATE=$(echo "$OVERVIEW_RESPONSE" | jq '.errorRateAvg' 2>/dev/null)
    
    echo -e "   Events/min data points: $EVENTS_PER_MIN"
    echo -e "   Top event types: $TOP_EVENTS"
    echo -e "   Dashboard load P95: ${LATENCY_P95}ms"
    echo -e "   Avg error rate: ${ERROR_RATE}%"
else
    echo -e "${RED}✗${NC} Failed to get overview"
    exit 1
fi

# Test 5: Tenant Events
echo -e "\n${BLUE}[5/7]${NC} Testing tenant events endpoint (last 24 hours)..."
EVENTS_RESPONSE=$(curl -s "${API_URL}/api/tenants/${TENANT_ID}/events?from=${FROM_DATE_24H}&to=${TO_DATE}&limit=10")
EVENTS_COUNT=$(echo "$EVENTS_RESPONSE" | jq '.events | length' 2>/dev/null)
TOTAL_EVENTS=$(echo "$EVENTS_RESPONSE" | jq '.total' 2>/dev/null)

if [ -n "$EVENTS_COUNT" ] && [ "$EVENTS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Events retrieved successfully"
    echo -e "   Returned: $EVENTS_COUNT events"
    echo -e "   Total available: $TOTAL_EVENTS events"
    
    # Show first event
    FIRST_EVENT_TYPE=$(echo "$EVENTS_RESPONSE" | jq -r '.events[0].eventType' 2>/dev/null)
    FIRST_EVENT_TIME=$(echo "$EVENTS_RESPONSE" | jq -r '.events[0].timestamp' 2>/dev/null)
    echo -e "   Latest event: $FIRST_EVENT_TYPE at $FIRST_EVENT_TIME"
else
    echo -e "${YELLOW}⚠${NC}  No events found in last 24 hours"
fi

# Test 6: Tenant Events with Filter
echo -e "\n${BLUE}[6/7]${NC} Testing events filtering (page_view events)..."
FILTERED_EVENTS=$(curl -s "${API_URL}/api/tenants/${TENANT_ID}/events?from=${FROM_DATE_24H}&to=${TO_DATE}&eventType=page_view&limit=5")
FILTERED_COUNT=$(echo "$FILTERED_EVENTS" | jq '.events | length' 2>/dev/null)

if [ -n "$FILTERED_COUNT" ]; then
    echo -e "${GREEN}✓${NC} Filtered events retrieved: $FILTERED_COUNT page views"
else
    echo -e "${YELLOW}⚠${NC}  No page_view events found"
fi

# Test 7: Tenant Metrics
echo -e "\n${BLUE}[7/7]${NC} Testing tenant metrics endpoint (last 1 hour)..."
METRICS_RESPONSE=$(curl -s "${API_URL}/api/tenants/${TENANT_ID}/metrics?from=${FROM_DATE_1H}&to=${TO_DATE}&serviceName=api")
METRICS_COUNT=$(echo "$METRICS_RESPONSE" | jq '. | length' 2>/dev/null)

if [ -n "$METRICS_COUNT" ] && [ "$METRICS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Metrics retrieved successfully"
    echo -e "   Metric series: $METRICS_COUNT"
    
    # Show metric names
    METRIC_NAMES=$(echo "$METRICS_RESPONSE" | jq -r '.[].metricName' 2>/dev/null | tr '\n' ', ' | sed 's/,$//')
    echo -e "   Metrics: $METRIC_NAMES"
    
    # Show data point count for first metric
    FIRST_METRIC_POINTS=$(echo "$METRICS_RESPONSE" | jq '.[0].timeSeries | length' 2>/dev/null)
    echo -e "   Data points: $FIRST_METRIC_POINTS"
else
    echo -e "${YELLOW}⚠${NC}  No metrics found in last hour"
fi

# Summary
echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All tests completed successfully!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   - View detailed data: npx prisma studio"
echo -e "   - Check example curls: cat backend/EXAMPLE_CURLS.md"
echo -e "   - Read API docs: cat backend/ANALYTICS_README.md"
echo -e "\n${YELLOW}🔗 Useful URLs:${NC}"
echo -e "   - API Base: ${API_URL}"
echo -e "   - Health: ${API_URL}/health"
echo -e "   - Tenants: ${API_URL}/api/tenants"
echo -e "   - Overview: ${API_URL}/api/tenants/${TENANT_ID}/overview?from=...&to=..."
echo ""

