import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RateLimitConfig } from "@/lib/rateLimit";

/**
 * Middleware wrapper to add rate limiting to API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest) => {
    // Use IP address as identifier (or could use user ID if authenticated)
    const identifier = req.headers.get("x-forwarded-for") || 
                      req.headers.get("x-real-ip") || 
                      "unknown";

    const result = await checkRateLimit(identifier, config);

    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: "Too many requests",
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetAt),
          }
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(req);
    response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.resetAt));

    return response;
  };
}
