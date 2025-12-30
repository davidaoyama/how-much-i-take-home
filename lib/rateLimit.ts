/**
 * Client-side rate limiting utility
 * Limits API calls to prevent abuse and manage API quota
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number; // Timestamp when the limit resets
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10, // 10 calculations per window
  windowMs: 60 * 1000, // 1 minute
};

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.loadFromStorage();
  }

  /**
   * Check if a new request is allowed
   */
  checkLimit(): RateLimitResult {
    const now = Date.now();

    // Remove expired requests outside the time window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    const allowed = this.requests.length < this.config.maxRequests;
    const remainingRequests = Math.max(
      0,
      this.config.maxRequests - this.requests.length
    );

    // Calculate when the oldest request will expire
    const oldestRequest = this.requests[0] || now;
    const resetTime = oldestRequest + this.config.windowMs;

    return {
      allowed,
      remainingRequests,
      resetTime,
    };
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    const now = Date.now();
    this.requests.push(now);
    this.saveToStorage();
  }

  /**
   * Get time until rate limit resets (in seconds)
   */
  getTimeUntilReset(): number {
    const result = this.checkLimit();
    const now = Date.now();
    return Math.max(0, Math.ceil((result.resetTime - now) / 1000));
  }

  /**
   * Save state to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        'salary_calculator_rate_limit',
        JSON.stringify({
          requests: this.requests,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn('Failed to save rate limit state:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('salary_calculator_rate_limit');
      if (stored) {
        const { requests } = JSON.parse(stored);
        this.requests = requests || [];

        // Clean up old requests on load
        const now = Date.now();
        this.requests = this.requests.filter(
          (timestamp) => now - timestamp < this.config.windowMs
        );
      }
    } catch (error) {
      console.warn('Failed to load rate limit state:', error);
      this.requests = [];
    }
  }

  /**
   * Reset the rate limiter (useful for testing)
   */
  reset(): void {
    this.requests = [];
    this.saveToStorage();
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(config?: RateLimitConfig): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter(config);
  }
  return rateLimiterInstance;
}

/**
 * Convenience function to check if a request is allowed
 */
export function checkRateLimit(): RateLimitResult {
  return getRateLimiter().checkLimit();
}

/**
 * Convenience function to record a request
 */
export function recordRequest(): void {
  getRateLimiter().recordRequest();
}
