import { Router } from "express";
import { EnhancedAnalyticsController } from "../controllers/enhanced-analytics.controller";
import { analyticsRateLimiter } from "../middleware/rateLimiter";

/**
 * Enhanced Analytics Routes with Scalability Features
 * 
 * All routes include:
 * - Rate limiting (100 requests/minute per IP/tenant)
 * - Circuit breaker protection
 * - High-load handling
 * - Smart caching
 */

const router = Router();
const controller = new EnhancedAnalyticsController();

// Apply rate limiting to all analytics routes
router.use(analyticsRateLimiter.middleware());

// Standard analytics summary with enhancements
router.get("/summary", controller.getSummary);

// Paginated analytics for large datasets
router.get("/summary/paginated", controller.getPaginatedSummary);

// Streaming analytics for real-time updates
router.get("/summary/stream", controller.streamSummary);

// Cache management
router.post("/cache/clear", controller.clearCache);
router.post("/clear-cache", controller.clearCache); // Backward compatibility
router.get("/cache/stats", controller.getCacheStats);

// Health check with system metrics
router.get("/health", controller.healthCheck);

export default router;

