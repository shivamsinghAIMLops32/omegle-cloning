import { createHash } from "crypto";

export interface Fingerprint {
  hash: string;
  components: {
    userAgent: string;
    screenResolution: string;
    timezone: number;
    language: string;
    platform: string;
    hardwareConcurrency: number;
  };
}

/**
 * Generate a browser fingerprint from client-side data
 * This should be called from the client and sent to the server
 */
export function generateFingerprint(data: {
  userAgent: string;
  screenResolution: string;
  timezone: number;
  language: string;
  platform: string;
  hardwareConcurrency: number;
}): Fingerprint {
  const components = [
    data.userAgent,
    data.screenResolution,
    data.timezone.toString(),
    data.language,
    data.platform,
    data.hardwareConcurrency.toString(),
  ];

  const fingerprintString = components.join("|");
  const hash = createHash("sha256").update(fingerprintString).digest("hex");

  return {
    hash,
    components: data,
  };
}

/**
 * Hash an IP address for privacy
 */
export function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * Get client IP from headers (supports proxies and load balancers)
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

/**
 * Combine IP hash and fingerprint hash for unique user identification
 */
export function generateUserIdentifier(ipHash: string, fingerprintHash: string): string {
  return createHash("sha256")
    .update(`${ipHash}:${fingerprintHash}`)
    .digest("hex");
}
