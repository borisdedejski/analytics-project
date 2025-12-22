#!/usr/bin/env tsx
/**
 * Quick script to get tenant IDs for testing
 * Usage: tsx scripts/get-tenant-ids.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Fetching tenant IDs...\n');

  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      region: true,
      plan: true,
      _count: {
        select: {
          users: true,
          events: true,
          metrics: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  if (tenants.length === 0) {
    console.log('❌ No tenants found. Run seed first: npm run seed');
    return;
  }

  console.log(`Found ${tenants.length} tenants:\n`);
  console.log('─'.repeat(120));
  console.log(
    'NAME'.padEnd(15),
    'ID'.padEnd(38),
    'REGION'.padEnd(15),
    'PLAN'.padEnd(12),
    'USERS'.padEnd(8),
    'EVENTS'.padEnd(10),
    'METRICS'
  );
  console.log('─'.repeat(120));

  tenants.forEach((tenant) => {
    console.log(
      tenant.name.padEnd(15),
      tenant.id.padEnd(38),
      tenant.region.padEnd(15),
      tenant.plan.padEnd(12),
      tenant._count.users.toString().padEnd(8),
      tenant._count.events.toString().padEnd(10),
      tenant._count.metrics.toString()
    );
  });

  console.log('─'.repeat(120));
  console.log('\n💡 Example usage:');
  console.log(`\nexport TENANT_ID="${tenants[0].id}"`);
  console.log(
    `curl "http://localhost:3001/api/tenants/$TENANT_ID/overview?from=$(date -u -v-7d +%Y-%m-%dT%H:%M:%SZ)&to=$(date -u +%Y-%m-%dT%H:%M:%SZ)"\n`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

