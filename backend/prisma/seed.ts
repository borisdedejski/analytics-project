import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Regions and plans for tenant diversity
const REGIONS = [
  "us-east-1",
  "us-west-2",
  "eu-west-1",
  "eu-central-1",
  "ap-southeast-1",
  "ap-northeast-1",
];
const PLANS = ["free", "pro", "enterprise"];
const ROLES = ["admin", "user", "viewer"];
const EVENT_TYPES = [
  "page_view",
  "button_click",
  "filter_applied",
  "dashboard_loaded",
  "export_csv",
  "login",
  "logout",
  "search",
  "form_submit",
];
const PAGES = [
  "/dashboard",
  "/analytics",
  "/reports",
  "/settings",
  "/users",
  "/billing",
  "/api-keys",
  "/documentation",
];
const DEVICES = ["desktop", "mobile", "tablet"];
const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge"];
const COUNTRIES = ["US", "UK", "DE", "FR", "JP", "IN", "BR", "CA", "AU", "SG"];
const SERVICES = ["api", "worker", "frontend"];
const METRIC_NAMES = [
  "api_latency_ms_p95",
  "api_latency_ms_p99",
  "error_rate",
  "cpu_usage",
  "memory_mb",
  "requests_per_sec",
];

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random element from array
 */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random email
 */
function randomEmail(index: number): string {
  const domains = ["example.com", "test.com", "demo.com", "acme.co"];
  return `user${index}@${randomPick(domains)}`;
}

/**
 * Get hour multiplier for realistic traffic patterns (higher during daytime)
 */
function getHourMultiplier(hour: number): number {
  // Simulate higher traffic during work hours (9 AM - 6 PM)
  if (hour >= 9 && hour <= 18) {
    return 3.0;
  } else if (hour >= 6 && hour <= 9) {
    return 1.5;
  } else if (hour >= 18 && hour <= 22) {
    return 2.0;
  }
  return 0.5; // Night time has less traffic
}

/**
 * Main seeding function
 */
async function main() {
  try {
    await prisma.metric.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.tenant.deleteMany({});
  } catch (error) {
    console.log(
      "⚠️  Could not clear existing data (tables might be empty):",
      error.message
    );
  }

  // 1. Create 10 tenants
  const tenants = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      return prisma.tenant.create({
        data: {
          name: `Tenant ${i + 1}`,
          region: randomPick(REGIONS),
          plan: randomPick(PLANS),
        },
      });
    })
  );

  const allUsers: any[] = [];

  // Create a special user for Boris in the first tenant
  const borisUser = await prisma.user.create({
    data: {
      tenantId: tenants[0].id,
      email: "borisdedejski@gmail.com",
      role: "admin",
    },
  });
  allUsers.push(borisUser);
  console.log(
    `  ✅ Created special user: borisdedejski@gmail.com (admin) in ${tenants[0].name}`
  );

  for (const tenant of tenants) {
    const userCount = randomInt(200, 2000);
    const users = await Promise.all(
      Array.from({ length: userCount }, async (_, i) => {
        return prisma.user.create({
          data: {
            tenantId: tenant.id,
            email: randomEmail(i),
            role: randomPick(ROLES),
          },
        });
      })
    );
    allUsers.push(...users);
    console.log(`  ✅ Created ${userCount} users for ${tenant.name}`);
  }
  console.log(`✅ Total users created: ${allUsers.length}`);

  // 3. Generate events for last 7 days with realistic spikes
  console.log("📊 Generating events for last 7 days...");
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let totalEvents = 0;
  const BATCH_SIZE = 1000;

  for (const tenant of tenants) {
    const tenantUsers = allUsers.filter((u) => u.tenantId === tenant.id);

    // Generate events day by day
    for (let day = 0; day < 7; day++) {
      const dayStart = new Date(
        sevenDaysAgo.getTime() + day * 24 * 60 * 60 * 1000
      );

      // Generate events hour by hour
      for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date(dayStart.getTime() + hour * 60 * 60 * 1000);
        const hourMultiplier = getHourMultiplier(hour);
        const eventsThisHour = Math.floor(randomInt(50, 200) * hourMultiplier);

        const eventBatch = [];
        for (let e = 0; e < eventsThisHour; e++) {
          const eventTime = new Date(
            hourStart.getTime() +
              randomInt(0, 59) * 60 * 1000 +
              randomInt(0, 59) * 1000
          );
          const user = randomPick(tenantUsers);
          const sessionId = `session_${user.id}_${day}_${hour}`;
          const eventType = randomPick(EVENT_TYPES);
          const page = randomPick(PAGES);
          const device = randomPick(DEVICES);
          const browser = randomPick(BROWSERS);
          const country = randomPick(COUNTRIES);

          // Cast metadata to Prisma.JsonObject to satisfy type checking
          eventBatch.push({
            tenantId: tenant.id,
            userId: user.id,
            sessionId: sessionId,
            eventType: eventType,
            timestamp: eventTime,
            metadata: {
              page,
              device,
              browser,
              country,
              feature:
                eventType === "button_click"
                  ? `${page.replace("/", "")}_action`
                  : null,
              button:
                eventType === "button_click"
                  ? randomPick(["submit", "export", "filter", "refresh"])
                  : null,
              value: eventType === "export_csv" ? randomInt(10, 1000) : null,
            } as import('@prisma/client').Prisma.JsonObject, // use correct type for Prisma.JsonObject
          });

          // Insert in batches
          if (eventBatch.length >= BATCH_SIZE) {
            await prisma.event.createMany({ data: eventBatch as any }); // (cast as any to handle batch typing)
            totalEvents += eventBatch.length;
            eventBatch.length = 0;
          }
        }

        // Insert remaining events
        if (eventBatch.length > 0) {
          await prisma.event.createMany({ data: eventBatch });
          totalEvents += eventBatch.length;
        }
      }
      console.log(
        `  ✅ Generated events for ${tenant.name} - Day ${day + 1}/7`
      );
    }
  }
  console.log(`✅ Total events created: ${totalEvents}`);

  // 4. Generate metrics for last 24 hours (every minute)
  console.log("📈 Generating metrics for last 24 hours...");
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  let totalMetrics = 0;
  for (const tenant of tenants) {
    const metricBatch = [];

    // Generate metrics for each minute in the last 24 hours
    for (let minute = 0; minute < 24 * 60; minute++) {
      const metricTime = new Date(
        twentyFourHoursAgo.getTime() + minute * 60 * 1000
      );
      const hour = metricTime.getHours();
      const isHighTraffic = hour >= 9 && hour <= 18;

      // Generate metrics for each service
      for (const service of SERVICES) {
        for (const metricName of METRIC_NAMES) {
          let value: number;

          // Generate realistic values with occasional spikes
          const hasSpike = Math.random() < 0.05; // 5% chance of spike

          switch (metricName) {
            case "api_latency_ms_p95":
              value = hasSpike ? randomInt(800, 2000) : randomInt(50, 200);
              break;
            case "api_latency_ms_p99":
              value = hasSpike ? randomInt(1500, 3000) : randomInt(100, 400);
              break;
            case "error_rate":
              value = hasSpike ? randomInt(5, 20) : Math.random() * 2; // 0-2% normal, 5-20% spike
              break;
            case "cpu_usage":
              value = isHighTraffic ? randomInt(40, 80) : randomInt(10, 40);
              break;
            case "memory_mb":
              value = randomInt(500, 2000);
              break;
            case "requests_per_sec":
              value = isHighTraffic ? randomInt(50, 500) : randomInt(5, 50);
              break;
            default:
              value = Math.random() * 100;
          }

          metricBatch.push({
            tenantId: tenant.id,
            serviceName: service,
            metricName,
            timestamp: metricTime,
            value,
          });

          // Insert in batches
          if (metricBatch.length >= BATCH_SIZE) {
            await prisma.metric.createMany({ data: metricBatch });
            totalMetrics += metricBatch.length;
            metricBatch.length = 0;
          }
        }
      }
    }

    // Insert remaining metrics
    if (metricBatch.length > 0) {
      await prisma.metric.createMany({ data: metricBatch });
      totalMetrics += metricBatch.length;
    }
    console.log(`  ✅ Generated metrics for ${tenant.name}`);
  }
  console.log(`✅ Total metrics created: ${totalMetrics}`);

  console.log("🎉 Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`  - Tenants: ${tenants.length}`);
  console.log(`  - Users: ${allUsers.length}`);
  console.log(`  - Events: ${totalEvents}`);
  console.log(`  - Metrics: ${totalMetrics}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
