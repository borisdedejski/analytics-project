import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service";
import {
  analyticsCircuitBreaker,
  highLoadHandler,
  LoadLevel,
} from "../services/circuit-breaker.service";
import cacheManager from "../services/cache-manager.service";

export class EnhancedAnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Get analytics summary with circuit breaker protection
   */
  getSummary = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    let isError = false;

    try {
      // Check if we should accept this request based on system load
      const priority = parseInt(req.headers["x-priority"] as string) || 5;
      const loadMetrics = highLoadHandler.getMetrics();

      if (!highLoadHandler.shouldAcceptRequest(priority)) {
        res
          .status(503)
          .json(highLoadHandler.getFallbackResponse("analytics-summary"));
        highLoadHandler.recordRequest(Date.now() - startTime, false);
        return;
      }

      // Log load information
      if (loadMetrics.level !== LoadLevel.NORMAL) {
        console.warn(`Processing request under ${loadMetrics.level} load`, {
          rps: loadMetrics.requestsPerSecond,
          priority,
        });
      }

      const query = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        groupBy:
          (req.query.groupBy as "hour" | "day" | "week" | "month") || "day",
      };

      if (!query.startDate || !query.endDate) {
        res.status(400).json({ error: "startDate and endDate are required" });
        return;
      }

      const tenantId = req.headers["x-tenant-id"] as string | undefined;
      const skipCache = req.query.skipCache === "true";

      // Execute with circuit breaker protection
      const summary = await analyticsCircuitBreaker.execute(
        async () => {
          return await this.analyticsService.getAnalyticsSummary(
            query,
            tenantId,
            skipCache
          );
        },
        // Fallback: return cached data or graceful degradation
        async () => {
          console.log("Using fallback response due to circuit breaker");

          // Try to get any cached data, even if stale
          const cachedData = await cacheManager.get(
            "analytics",
            `summary:${query.startDate}:${query.endDate}:${query.groupBy}`,
            { tenantId }
          );

          if (cachedData) {
            return cachedData;
          }

          // Last resort: return empty data structure
          return {
            totalEvents: 0,
            uniqueUsers: 0,
            eventsByType: [],
            timeSeriesData: [],
            topPages: [],
            deviceStats: [],
          };
        }
      );

      // Add metadata about system health
      const response = {
        ...summary,
        _metadata: {
          loadLevel: loadMetrics.level,
          cached: skipCache ? false : undefined,
          responseTime: Date.now() - startTime,
        },
      };

      res.json(response);
    } catch (error) {
      isError = true;
      console.error("Enhanced analytics error:", error);
      res.status(500).json({
        error: "Failed to fetch analytics summary",
        loadLevel: highLoadHandler.getMetrics().level,
      });
    } finally {
      highLoadHandler.recordRequest(Date.now() - startTime, isError);
    }
  };

  /**
   * Get paginated analytics data for large datasets
   */
  getPaginatedSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        startDate,
        endDate,
        groupBy = "day",
        cursor,
        limit = "50",
      } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ error: "startDate and endDate are required" });
        return;
      }

      const tenantId = req.headers["x-tenant-id"] as string | undefined;
      const pageSize = Math.min(parseInt(limit as string), 1000); // Max 1000 items

      // For time-series data, cursor is a timestamp
      const cursorDate = cursor
        ? new Date(cursor as string)
        : new Date(startDate as string);

      const summary = await this.analyticsService.getAnalyticsSummary(
        {
          startDate: startDate as string,
          endDate: endDate as string,
          groupBy: groupBy as "hour" | "day" | "week" | "month",
        },
        tenantId
      );

      // Paginate time series data
      const cursorIndex = summary.timeSeriesData.findIndex(
        (item) => new Date(item.timestamp) >= cursorDate
      );

      const startIndex = cursorIndex >= 0 ? cursorIndex : 0;
      const endIndex = startIndex + pageSize;
      const paginatedData = summary.timeSeriesData.slice(startIndex, endIndex);

      const hasMore = endIndex < summary.timeSeriesData.length;
      const nextCursor = hasMore
        ? paginatedData[paginatedData.length - 1].timestamp
        : null;

      res.json({
        data: {
          ...summary,
          timeSeriesData: paginatedData,
        },
        pagination: {
          cursor: cursor || null,
          nextCursor,
          hasMore,
          limit: pageSize,
          total: summary.timeSeriesData.length,
        },
      });
    } catch (error) {
      console.error("Paginated analytics error:", error);
      res.status(500).json({ error: "Failed to fetch paginated analytics" });
    }
  };

  /**
   * Stream analytics data for real-time updates
   */
  streamSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        groupBy:
          (req.query.groupBy as "hour" | "day" | "week" | "month") || "day",
      };

      if (!query.startDate || !query.endDate) {
        res.status(400).json({ error: "startDate and endDate are required" });
        return;
      }

      const tenantId = req.headers["x-tenant-id"] as string | undefined;

      // Set headers for SSE (Server-Sent Events)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send initial data
      const summary = await this.analyticsService.getAnalyticsSummary(
        query,
        tenantId
      );
      res.write(`data: ${JSON.stringify(summary)}\n\n`);

      // Send updates every 5 seconds
      const intervalId = setInterval(async () => {
        try {
          const updatedSummary =
            await this.analyticsService.getAnalyticsSummary(
              query,
              tenantId,
              true // Skip cache for real-time data
            );
          res.write(`data: ${JSON.stringify(updatedSummary)}\n\n`);
        } catch (error) {
          console.error("Error streaming analytics:", error);
          clearInterval(intervalId);
          res.end();
        }
      }, 5000);

      // Clean up on client disconnect
      req.on("close", () => {
        clearInterval(intervalId);
        res.end();
      });
    } catch (error) {
      console.error("Stream analytics error:", error);
      res.status(500).json({ error: "Failed to stream analytics" });
    }
  };

  /**
   * Clear cache with smart invalidation
   */
  clearCache = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.headers["x-tenant-id"] as string | undefined;
      await this.analyticsService.clearCache(tenantId);

      res.json({
        message: "Cache cleared successfully",
        tenantId: tenantId || "all",
      });
    } catch (error) {
      console.error("Cache clear error:", error);
      res.status(500).json({ error: "Failed to clear cache" });
    }
  };

  /**
   * Get cache statistics
   */
  getCacheStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await cacheManager.getStats();
      const circuitStats = analyticsCircuitBreaker.getStats();
      const loadMetrics = highLoadHandler.getMetrics();

      res.json({
        cache: stats,
        circuitBreaker: circuitStats,
        load: loadMetrics,
      });
    } catch (error) {
      console.error("Error getting cache stats:", error);
      res.status(500).json({ error: "Failed to get cache statistics" });
    }
  };

  /**
   * Health check endpoint with system metrics
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const circuitStats = analyticsCircuitBreaker.getStats();
      const loadMetrics = highLoadHandler.getMetrics();
      const cacheStats = await cacheManager.getStats();

      const isHealthy =
        circuitStats.state !== "OPEN" &&
        loadMetrics.level !== LoadLevel.CRITICAL;

      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        metrics: {
          circuitBreaker: circuitStats,
          load: loadMetrics,
          cache: {
            hitRate: cacheStats.hitRate,
            size: cacheStats.size,
          },
        },
      });
    } catch (error) {
      console.error("Health check error:", error);
      res.status(503).json({
        status: "unhealthy",
        error: "Health check failed",
      });
    }
  };
}
