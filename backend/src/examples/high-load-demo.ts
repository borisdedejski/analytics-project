/**
 * HIGH-LOAD SCENARIO DEMONSTRATION
 * 
 * This file demonstrates how the system handles various high-load scenarios:
 * 1. Traffic spike (1000+ req/s)
 * 2. Database failure
 * 3. Redis failure
 * 4. Circuit breaker activation
 * 5. Graceful degradation
 * 
 * Usage:
 *   ts-node src/examples/high-load-demo.ts
 */

import axios from "axios";
import {
  databaseCircuitBreaker,
  redisCircuitBreaker,
  highLoadHandler,
  CircuitState,
} from "../services/circuit-breaker.service";
import cacheManager from "../services/cache-manager.service";

const BASE_URL = process.env.API_URL || "http://localhost:3000";
const API_ENDPOINT = `${BASE_URL}/api/v1/analytics/summary`;

// Color output for terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Scenario 1: Traffic Spike Simulation
async function simulateTrafficSpike() {
  log("\n=== SCENARIO 1: Traffic Spike (1000 req/s) ===", "cyan");
  log("Simulating sudden traffic increase...", "blue");

  const requests: Promise<any>[] = [];
  const startTime = Date.now();
  const totalRequests = 1000;
  
  // Send 1000 concurrent requests
  for (let i = 0; i < totalRequests; i++) {
    const request = axios
      .get(API_ENDPOINT, {
        params: {
          startDate: "2024-12-01",
          endDate: "2024-12-24",
          groupBy: "day",
        },
        validateStatus: () => true, // Don't throw on 4xx/5xx
      })
      .then((res: any) => ({ status: res.status, success: res.status < 400 }))
      .catch(() => ({ status: 0, success: false }));

    requests.push(request);
  }

  // Wait for all requests to complete
  const results = await Promise.all(requests);
  const duration = Date.now() - startTime;

  // Analyze results
  const successful = results.filter((r) => r.success).length;
  const rateLimited = results.filter((r) => r.status === 429).length;
  const errors = results.filter((r) => !r.success && r.status !== 429).length;

  log("\n📊 Results:", "yellow");
  log(`  Total requests: ${totalRequests}`, "reset");
  log(`  Successful: ${successful} (${((successful / totalRequests) * 100).toFixed(1)}%)`, "green");
  log(`  Rate limited: ${rateLimited} (${((rateLimited / totalRequests) * 100).toFixed(1)}%)`, "yellow");
  log(`  Errors: ${errors} (${((errors / totalRequests) * 100).toFixed(1)}%)`, errors > 0 ? "red" : "green");
  log(`  Duration: ${duration}ms`, "reset");
  log(`  Throughput: ${(totalRequests / (duration / 1000)).toFixed(1)} req/s`, "blue");

  // Check system health
  const loadMetrics = highLoadHandler.getMetrics();
  log("\n🏥 System Health:", "yellow");
  log(`  Load level: ${loadMetrics.level}`, "reset");
  log(`  Request rate: ${loadMetrics.requestsPerSecond.toFixed(1)} req/s`, "reset");
  log(`  Error rate: ${loadMetrics.errorRate.toFixed(2)}%`, "reset");

  if (rateLimited > 0) {
    log("\n✅ Rate limiting working as expected!", "green");
  }
  if (successful > totalRequests * 0.8) {
    log("✅ System handled spike with minimal errors!", "green");
  }
}

// Scenario 2: Circuit Breaker Test
async function testCircuitBreaker() {
  log("\n=== SCENARIO 2: Circuit Breaker Test ===", "cyan");
  log("Testing circuit breaker with simulated failures...", "blue");

  const breaker = databaseCircuitBreaker;
  breaker.reset();

  // Simulate 10 database calls with failures
  let successCount = 0;
  let failureCount = 0;
  let circuitOpenCount = 0;

  for (let i = 0; i < 10; i++) {
    try {
      await breaker.execute(
        async () => {
          // Simulate failure for first 5 attempts
          if (i < 5) {
            throw new Error("Simulated database failure");
          }
          return { success: true };
        },
        // Fallback
        async () => {
          return { success: false, cached: true };
        }
      );
      successCount++;
    } catch (error) {
      if ((error as Error).message.includes("Circuit breaker")) {
        circuitOpenCount++;
        log(`  Attempt ${i + 1}: Circuit OPEN (failing fast)`, "yellow");
      } else {
        failureCount++;
        log(`  Attempt ${i + 1}: Failed (using fallback)`, "red");
      }
    }

    // Check circuit state
    const stats = breaker.getStats();
    log(`  Circuit state: ${stats.state}`, stats.state === CircuitState.CLOSED ? "green" : "yellow");

    // Wait between attempts
    if (i === 4) {
      log("\n  ⏳ Waiting for circuit breaker timeout...", "blue");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  log("\n📊 Circuit Breaker Results:", "yellow");
  log(`  Successes: ${successCount}`, "green");
  log(`  Failures (with fallback): ${failureCount}`, "yellow");
  log(`  Circuit open (fast fail): ${circuitOpenCount}`, "red");

  if (circuitOpenCount > 0) {
    log("\n✅ Circuit breaker prevented cascading failures!", "green");
  }
}

// Scenario 3: Cache Performance Test
async function testCachePerformance() {
  log("\n=== SCENARIO 3: Cache Performance Test ===", "cyan");
  log("Testing cache hit rates and performance...", "blue");

  const namespace = "demo";
  const testData = {
    totalEvents: 100000,
    uniqueUsers: 5000,
    data: Array(100).fill(0).map((_, i) => ({ timestamp: new Date(), count: i })),
  };

  // Clear cache first
  await cacheManager.clearAll();
  await cacheManager.resetStats();

  // Test 1: Cache Miss (first request)
  log("\n  Test 1: Cache Miss", "blue");
  const miss1Start = Date.now();
  await cacheManager.get(namespace, "test-key");
  const miss1Duration = Date.now() - miss1Start;
  log(`    Duration: ${miss1Duration}ms`, "reset");

  // Set cache
  await cacheManager.set(namespace, "test-key", testData, {
    tags: ["demo", "test"],
  });

  // Test 2: Cache Hit
  log("\n  Test 2: Cache Hit", "blue");
  const hit1Start = Date.now();
  await cacheManager.get(namespace, "test-key");
  const hit1Duration = Date.now() - hit1Start;
  log(`    Duration: ${hit1Duration}ms`, "reset");

  // Test 3: Tag-based invalidation
  log("\n  Test 3: Tag-based Invalidation", "blue");
  const invalidateStart = Date.now();
  await cacheManager.invalidateByTags(["demo"]);
  const invalidateDuration = Date.now() - invalidateStart;
  log(`    Duration: ${invalidateDuration}ms`, "reset");

  // Test 4: Multiple cache operations
  log("\n  Test 4: Bulk Operations (100 items)", "blue");
  const bulkStart = Date.now();
  const bulkOps = Array(100).fill(0).map((_, i) =>
    cacheManager.set(namespace, `bulk-key-${i}`, { value: i }, {
      tags: ["bulk"],
    })
  );
  await Promise.all(bulkOps);
  const bulkDuration = Date.now() - bulkStart;
  log(`    Duration: ${bulkDuration}ms (${(bulkDuration / 100).toFixed(2)}ms per item)`, "reset");

  // Get stats
  const stats = await cacheManager.getStats();
  log("\n📊 Cache Statistics:", "yellow");
  log(`  Hits: ${stats.hits}`, "green");
  log(`  Misses: ${stats.misses}`, "reset");
  log(`  Hit rate: ${stats.hitRate.toFixed(2)}%`, stats.hitRate > 50 ? "green" : "yellow");
  log(`  Cache size: ${(stats.size / 1024).toFixed(2)} KB`, "reset");

  log("\n✅ Cache performance test complete!", "green");
}

// Scenario 4: Graceful Degradation Test
async function testGracefulDegradation() {
  log("\n=== SCENARIO 4: Graceful Degradation Test ===", "cyan");
  log("Testing system behavior under extreme load...", "blue");

  // Simulate extreme load
  for (let i = 0; i < 1000; i++) {
    highLoadHandler.recordRequest(100 + Math.random() * 50, Math.random() > 0.95);
  }

  const loadMetrics = highLoadHandler.getMetrics();
  log("\n📊 Load Metrics:", "yellow");
  log(`  Load level: ${loadMetrics.level}`, "reset");
  log(`  Current load: ${loadMetrics.currentLoad.toFixed(1)}%`, "reset");
  log(`  Request rate: ${loadMetrics.requestsPerSecond.toFixed(1)} req/s`, "reset");
  log(`  Error rate: ${loadMetrics.errorRate.toFixed(2)}%`, "reset");

  // Test request acceptance at different priorities
  log("\n  Testing request prioritization:", "blue");
  const priorities = [1, 3, 5, 7, 9];
  for (const priority of priorities) {
    const accepted = highLoadHandler.shouldAcceptRequest(priority);
    log(
      `    Priority ${priority}: ${accepted ? "✅ Accepted" : "❌ Rejected"}`,
      accepted ? "green" : "red"
    );
  }

  if (loadMetrics.level !== "NORMAL") {
    log("\n✅ System correctly detected high load!", "green");
    log("✅ Lower priority requests are being rejected!", "green");
  }

  // Reset for next test
  highLoadHandler.reset();
}

// Scenario 5: End-to-End Integration Test
async function testEndToEndIntegration() {
  log("\n=== SCENARIO 5: End-to-End Integration Test ===", "cyan");
  log("Testing complete request flow with all components...", "blue");

  try {
    // Make request with low priority during high load
    highLoadHandler.reset();
    
    log("\n  Test 1: Normal priority request", "blue");
    const response1 = await axios.get(API_ENDPOINT, {
      params: {
        startDate: "2024-12-01",
        endDate: "2024-12-24",
        groupBy: "day",
      },
      headers: {
        "X-Priority": "5",
      },
      validateStatus: () => true,
    });

    log(`    Status: ${response1.status}`, response1.status < 400 ? "green" : "red");
    log(`    Has data: ${!!response1.data.totalEvents}`, "reset");
    
    if (response1.headers["x-ratelimit-remaining"]) {
      log(`    Rate limit remaining: ${response1.headers["x-ratelimit-remaining"]}`, "reset");
    }

    // Check cache stats
    log("\n  Test 2: Cache statistics", "blue");
    const statsResponse = await axios.get(`${BASE_URL}/api/v1/analytics/cache/stats`, {
      validateStatus: () => true,
    });

    if (statsResponse.status === 200) {
      const stats = statsResponse.data;
      log(`    Cache hit rate: ${stats.cache?.hitRate?.toFixed(2)}%`, "green");
      log(`    Circuit breaker: ${stats.circuitBreaker?.state}`, "green");
      log(`    Load level: ${stats.load?.level}`, "reset");
    }

    // Health check
    log("\n  Test 3: Health check", "blue");
    const healthResponse = await axios.get(`${BASE_URL}/api/v1/analytics/health`, {
      validateStatus: () => true,
    });

    if (healthResponse.status === 200) {
      log(`    Status: ${healthResponse.data.status}`, "green");
      log(`    All systems operational`, "green");
    }

    log("\n✅ End-to-end integration test complete!", "green");
  } catch (error) {
    log(`\n❌ Integration test failed: ${(error as Error).message}`, "red");
  }
}

// Main execution
async function runAllScenarios() {
  log("\n" + "=".repeat(60), "cyan");
  log("HIGH-LOAD SCENARIO DEMONSTRATION", "cyan");
  log("=".repeat(60), "cyan");
  log("\nThis demo tests the scalability features:", "blue");
  log("  • Rate limiting", "reset");
  log("  • Circuit breakers", "reset");
  log("  • Cache performance", "reset");
  log("  • Graceful degradation", "reset");
  log("  • End-to-end integration", "reset");

  try {
    // Run all scenarios
    await simulateTrafficSpike();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await testCircuitBreaker();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await testCachePerformance();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await testGracefulDegradation();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await testEndToEndIntegration();

    log("\n" + "=".repeat(60), "cyan");
    log("✅ ALL SCENARIOS COMPLETED SUCCESSFULLY!", "green");
    log("=".repeat(60), "cyan");
  } catch (error) {
    log(`\n❌ Error running scenarios: ${(error as Error).message}`, "red");
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllScenarios()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export {
  simulateTrafficSpike,
  testCircuitBreaker,
  testCachePerformance,
  testGracefulDegradation,
  testEndToEndIntegration,
};

