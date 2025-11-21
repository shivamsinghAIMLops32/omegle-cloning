import { redis } from "./redis";

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

/**
 * Redis-based rate limiter using sliding window
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  try {
    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const count = await redis.zcard(key);

    if (count >= config.maxRequests) {
      // Get the oldest request timestamp to calculate reset time
      const oldestRequests = await redis.zrange(key, 0, 0, "WITHSCORES");
      const resetAt = oldestRequests.length > 0 
        ? parseInt(oldestRequests[1]) + config.windowSeconds * 1000
        : now + config.windowSeconds * 1000;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request
    await redis.zadd(key, now, `${now}`);
    await redis.expire(key, config.windowSeconds);

    return {
      allowed: true,
      remaining: config.maxRequests - count - 1,
      resetAt: now + config.windowSeconds * 1000,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if rate limiting fails
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowSeconds * 1000,
    };
  }
}

// Preset configurations
export const RATE_LIMITS = {
  // API routes
  API_DEFAULT: { maxRequests: 100, windowSeconds: 60 }, // 100 req/min
  API_STRICT: { maxRequests: 20, windowSeconds: 60 }, // 20 req/min (auth, reports)
  
  // Matchmaking
  MATCHMAKING: { maxRequests: 10, windowSeconds: 60 }, // 10 joins/min
  
  // Messages
  MESSAGING: { maxRequests: 60, windowSeconds: 60 }, // 60 msg/min
};
