/**
 * Circuit Breaker Pattern for High-Load Scenarios
 * 
 * PATTERN EXPLANATION:
 * ===================
 * The Circuit Breaker pattern prevents cascading failures in distributed systems.
 * It has three states:
 * 
 * 1. CLOSED (Normal Operation):
 *    - All requests pass through
 *    - Failures are tracked
 *    - If failure threshold is exceeded, circuit opens
 * 
 * 2. OPEN (Failing Fast):
 *    - Requests fail immediately without attempting
 *    - Prevents overwhelming a failing service
 *    - After timeout, transitions to HALF_OPEN
 * 
 * 3. HALF_OPEN (Testing Recovery):
 *    - Limited requests are allowed through
 *    - If requests succeed, circuit closes
 *    - If requests fail, circuit reopens
 * 
 * HIGH-LOAD HANDLING:
 * - Prevents cascade failures during traffic spikes
 * - Provides fallback responses
 * - Tracks health metrics
 * - Automatic recovery when service stabilizes
 */

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  successThreshold: number;    // Number of successes to close from half-open
  timeout: number;             // Time in ms before attempting half-open
  monitoringPeriod: number;    // Time window for tracking failures
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  totalRequests: number;
  lastFailureTime?: number;
  nextAttemptTime?: number;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private totalRequests: number = 0;
  private lastFailureTime?: number;
  private nextAttemptTime?: number;
  private config: CircuitBreakerConfig;
  private readonly name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000, // 1 minute
      monitoringPeriod: config.monitoringPeriod || 300000, // 5 minutes
    };
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    this.totalRequests++;

    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime!) {
        console.log(`Circuit breaker ${this.name} is OPEN, failing fast`);
        
        if (fallback) {
          return await fallback();
        }
        
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
      
      // Transition to half-open
      this.state = CircuitState.HALF_OPEN;
      this.successes = 0;
      console.log(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      
      if (fallback) {
        return await fallback();
      }
      
      throw error;
    }
  }

  /**
   * Handle successful request
   */
  private onSuccess(): void {
    this.failures = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successes = 0;
        console.log(`Circuit breaker ${this.name} is now CLOSED`);
      }
    }
  }

  /**
   * Handle failed request
   */
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (
      this.state === CircuitState.HALF_OPEN ||
      this.failures >= this.config.failureThreshold
    ) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.timeout;
      console.log(
        `Circuit breaker ${this.name} is now OPEN until ${new Date(
          this.nextAttemptTime
        ).toISOString()}`
      );
    }
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      totalRequests: this.totalRequests,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Force circuit state (useful for testing or manual intervention)
   */
  forceState(state: CircuitState): void {
    console.log(`Circuit breaker ${this.name} manually set to ${state}`);
    this.state = state;
    this.failures = 0;
    this.successes = 0;
  }

  /**
   * Reset circuit breaker statistics
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.totalRequests = 0;
    this.lastFailureTime = undefined;
    this.nextAttemptTime = undefined;
  }
}

/**
 * High Load Handler - Manages system behavior during traffic spikes
 * 
 * STRATEGIES:
 * 1. Load Shedding - Reject low-priority requests
 * 2. Graceful Degradation - Return cached/simplified data
 * 3. Request Prioritization - VIP/paid users get priority
 * 4. Backpressure - Slow down request acceptance
 */

export enum LoadLevel {
  NORMAL = "NORMAL",
  ELEVATED = "ELEVATED",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface LoadMetrics {
  level: LoadLevel;
  currentLoad: number;
  requestsPerSecond: number;
  avgResponseTime: number;
  errorRate: number;
  queueSize: number;
}

export class HighLoadHandler {
  private requestTimes: number[] = [];
  private errorCount: number = 0;
  private totalRequests: number = 0;
  private readonly maxQueueSize = 1000;
  private readonly monitoringWindow = 60000; // 1 minute

  // Load thresholds
  private readonly thresholds = {
    elevated: 100,    // requests per second
    high: 250,
    critical: 500,
  };

  /**
   * Record request metrics
   */
  recordRequest(duration: number, isError: boolean = false): void {
    const now = Date.now();
    this.requestTimes.push(now);
    this.totalRequests++;
    
    if (isError) {
      this.errorCount++;
    }

    // Clean old entries
    this.cleanOldEntries();
  }

  /**
   * Get current load level
   */
  getLoadLevel(): LoadLevel {
    const rps = this.getRequestsPerSecond();
    
    if (rps >= this.thresholds.critical) {
      return LoadLevel.CRITICAL;
    } else if (rps >= this.thresholds.high) {
      return LoadLevel.HIGH;
    } else if (rps >= this.thresholds.elevated) {
      return LoadLevel.ELEVATED;
    }
    
    return LoadLevel.NORMAL;
  }

  /**
   * Get current load metrics
   */
  getMetrics(): LoadMetrics {
    const rps = this.getRequestsPerSecond();
    const level = this.getLoadLevel();
    
    return {
      level,
      currentLoad: (rps / this.thresholds.critical) * 100,
      requestsPerSecond: rps,
      avgResponseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      queueSize: this.requestTimes.length,
    };
  }

  /**
   * Determine if request should be accepted based on priority
   */
  shouldAcceptRequest(priority: number = 5): boolean {
    const level = this.getLoadLevel();
    
    switch (level) {
      case LoadLevel.NORMAL:
        return true;
      case LoadLevel.ELEVATED:
        return priority >= 3; // Reject low priority
      case LoadLevel.HIGH:
        return priority >= 7; // Only medium-high priority
      case LoadLevel.CRITICAL:
        return priority >= 9; // Only critical requests
      default:
        return true;
    }
  }

  /**
   * Get fallback response for rejected requests
   */
  getFallbackResponse(requestType: string): any {
    const level = this.getLoadLevel();
    
    return {
      error: "Service Temporarily Unavailable",
      message: `System is experiencing ${level} load. Please try again shortly.`,
      loadLevel: level,
      retryAfter: this.getRetryAfterSeconds(level),
      requestType,
    };
  }

  /**
   * Calculate retry-after time based on load
   */
  private getRetryAfterSeconds(level: LoadLevel): number {
    switch (level) {
      case LoadLevel.ELEVATED:
        return 5;
      case LoadLevel.HIGH:
        return 30;
      case LoadLevel.CRITICAL:
        return 60;
      default:
        return 1;
    }
  }

  /**
   * Get requests per second
   */
  private getRequestsPerSecond(): number {
    this.cleanOldEntries();
    const windowSeconds = this.monitoringWindow / 1000;
    return this.requestTimes.length / windowSeconds;
  }

  /**
   * Get average response time (placeholder)
   */
  private getAverageResponseTime(): number {
    // In production, track actual response times
    return 150; // ms
  }

  /**
   * Get error rate
   */
  private getErrorRate(): number {
    if (this.totalRequests === 0) return 0;
    return (this.errorCount / this.totalRequests) * 100;
  }

  /**
   * Clean entries outside monitoring window
   */
  private cleanOldEntries(): void {
    const cutoff = Date.now() - this.monitoringWindow;
    this.requestTimes = this.requestTimes.filter((time) => time > cutoff);
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.requestTimes = [];
    this.errorCount = 0;
    this.totalRequests = 0;
  }
}

// Export singleton instances for common use cases
export const databaseCircuitBreaker = new CircuitBreaker("database", {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30 seconds
});

export const redisCircuitBreaker = new CircuitBreaker("redis", {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 10000, // 10 seconds
});

export const analyticsCircuitBreaker = new CircuitBreaker("analytics", {
  failureThreshold: 10,
  successThreshold: 3,
  timeout: 60000, // 1 minute
});

export const highLoadHandler = new HighLoadHandler();

