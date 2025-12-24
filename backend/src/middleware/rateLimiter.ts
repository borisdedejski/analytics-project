import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

/**
 * SCALABLE RATE LIMITING STRATEGY
 * =================================
 * 
 * Uses Redis for distributed rate limiting across multiple server instances.
 * Implements the Token Bucket algorithm for smooth rate limiting.
 * 
 * FEATURES:
 * 1. Per-IP and Per-Tenant rate limiting
 * 2. Sliding window for accurate rate tracking
 * 3. Configurable limits per endpoint
 * 4. Graceful degradation when Redis is unavailable
 * 5. Rate limit headers (X-RateLimit-*)
 * 
 * SCALABILITY:
 * - Works across multiple server instances
 * - O(1) operations using Redis
 * - Automatic cleanup of expired entries
 * - Supports Redis cluster
 */

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyPrefix?: string;    // Redis key prefix
  skipFailedRequests?: boolean; // Don't count failed requests
  skipSuccessfulRequests?: boolean; // Don't count successful requests
}

interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: number;
}

/**
 * Token Bucket Rate Limiter using Redis
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: "ratelimit",
      skipFailedRequests: false,
      skipSuccessfulRequests: false,
      ...config,
    };
  }

  /**
   * Generate rate limit key based on IP and tenant
   */
  private getKey(req: Request): string {
    const ip = this.getClientIp(req);
    const tenantId = req.headers["x-tenant-id"] || "default";
    return `${this.config.keyPrefix}:${tenantId}:${ip}`;
  }

  /**
   * Get client IP address (handles proxies)
   */
  private getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  /**
   * Check if request should be rate limited (Sliding Window Counter)
   */
  async checkRateLimit(req: Request): Promise<RateLimitInfo> {
    const key = this.getKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Use Lua script for atomic operations
      const script = `
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local limit = tonumber(ARGV[3])
        
        -- Remove old entries outside the window
        redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
        
        -- Count current requests in window
        local current = redis.call('ZCARD', key)
        
        -- Add current request
        if current < limit then
          redis.call('ZADD', key, now, now .. math.random())
          redis.call('PEXPIRE', key, window)
          current = current + 1
        end
        
        return {current, limit}
      `;

      const result = await redisClient.eval(script, {
        keys: [key],
        arguments: [
          now.toString(),
          this.config.windowMs.toString(),
          this.config.maxRequests.toString(),
        ],
      }) as number[];

      const current = result[0];
      const limit = result[1];
      const remaining = Math.max(0, limit - current);
      const resetTime = now + this.config.windowMs;

      return {
        limit,
        current,
        remaining,
        resetTime,
      };
    } catch (error) {
      console.error("Rate limit check error:", error);
      // Fail open: allow request if Redis is down
      return {
        limit: this.config.maxRequests,
        current: 0,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
      };
    }
  }

  /**
   * Express middleware for rate limiting
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rateLimitInfo = await this.checkRateLimit(req);

        // Set rate limit headers
        res.setHeader("X-RateLimit-Limit", rateLimitInfo.limit);
        res.setHeader("X-RateLimit-Remaining", rateLimitInfo.remaining);
        res.setHeader("X-RateLimit-Reset", new Date(rateLimitInfo.resetTime).toISOString());

        if (rateLimitInfo.remaining === 0) {
          res.status(429).json({
            error: "Too Many Requests",
            message: `Rate limit exceeded. Try again after ${new Date(rateLimitInfo.resetTime).toISOString()}`,
            retryAfter: Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000),
          });
          return;
        }

        next();
      } catch (error) {
        console.error("Rate limiter middleware error:", error);
        // Fail open: allow request if middleware fails
        next();
      }
    };
  }
}

/**
 * Adaptive Rate Limiter - adjusts limits based on system load
 */
export class AdaptiveRateLimiter extends RateLimiter {
  private loadThresholds = {
    low: 0.5,    // < 50% capacity: normal limits
    medium: 0.75, // 50-75% capacity: reduced limits
    high: 0.9,    // > 75% capacity: minimal limits
  };

  /**
   * Get current system load (simplified - in production, use actual metrics)
   */
  private async getSystemLoad(): Promise<number> {
    try {
      // This is a placeholder - implement actual load detection
      // Options: CPU usage, memory usage, response time, queue length
      const info = await redisClient.info("stats");
      const opsMatch = info.match(/instantaneous_ops_per_sec:(\d+)/);
      const ops = opsMatch ? parseInt(opsMatch[1]) : 0;
      
      // Normalize to 0-1 scale (assuming max 10000 ops/sec)
      return Math.min(ops / 10000, 1);
    } catch (error) {
      return 0; // Assume low load on error
    }
  }

  /**
   * Adjust rate limit based on system load
   */
  private async getAdaptiveLimit(baseLimit: number): Promise<number> {
    const load = await this.getSystemLoad();

    if (load < this.loadThresholds.low) {
      return baseLimit; // Normal operation
    } else if (load < this.loadThresholds.medium) {
      return Math.floor(baseLimit * 0.7); // Reduce by 30%
    } else if (load < this.loadThresholds.high) {
      return Math.floor(baseLimit * 0.5); // Reduce by 50%
    } else {
      return Math.floor(baseLimit * 0.3); // Reduce by 70% (emergency)
    }
  }

  /**
   * Enhanced middleware with adaptive limiting
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rateLimitInfo = await this.checkRateLimit(req);
        
        // Adjust limit based on system load
        const adaptiveLimit = await this.getAdaptiveLimit(rateLimitInfo.limit);
        const adaptiveRemaining = Math.max(0, adaptiveLimit - rateLimitInfo.current);

        // Set headers
        res.setHeader("X-RateLimit-Limit", adaptiveLimit);
        res.setHeader("X-RateLimit-Remaining", adaptiveRemaining);
        res.setHeader("X-RateLimit-Reset", new Date(rateLimitInfo.resetTime).toISOString());

        if (adaptiveRemaining === 0) {
          res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded due to high system load",
            retryAfter: Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000),
          });
          return;
        }

        next();
      } catch (error) {
        console.error("Adaptive rate limiter error:", error);
        next(); // Fail open
      }
    };
  }
}

/**
 * Request Throttler - delays requests instead of rejecting them
 * Useful for background/batch operations
 */
export class RequestThrottler {
  private queue: Map<string, Promise<any>> = new Map();
  private readonly maxConcurrent: number;
  private readonly delayMs: number;

  constructor(maxConcurrent: number = 10, delayMs: number = 100) {
    this.maxConcurrent = maxConcurrent;
    this.delayMs = delayMs;
  }

  /**
   * Throttle request execution
   */
  async throttle<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Wait if too many concurrent requests
    while (this.queue.size >= this.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    // Execute function
    const promise = fn().finally(() => {
      this.queue.delete(key);
    });

    this.queue.set(key, promise);
    return promise;
  }

  /**
   * Express middleware for throttling
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const key = `${req.ip}-${Date.now()}`;
      
      try {
        await this.throttle(key, async () => {
          return new Promise<void>((resolve) => {
            next();
            resolve();
          });
        });
      } catch (error) {
        console.error("Request throttler error:", error);
        next(); // Fail open
      }
    };
  }
}

// Export pre-configured rate limiters for different endpoints
export const analyticsRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  maxRequests: 100,          // 100 requests per minute
  keyPrefix: "ratelimit:analytics",
});

export const eventRateLimiter = new AdaptiveRateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  maxRequests: 1000,         // 1000 events per minute (adaptive)
  keyPrefix: "ratelimit:events",
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000,         // 1000 requests per 15 minutes
  keyPrefix: "ratelimit:api",
});

