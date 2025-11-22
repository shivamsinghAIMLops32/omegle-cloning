// IP Geolocation helper using ip-api.com (free, no API key needed)

export interface LocationData {
  country: string;
  city: string;
  countryCode: string;
  region: string;
  timezone: string;
}

/**
 * Get location data from IP address using ip-api.com
 * Free tier: 45 requests per minute
 */
export async function getLocationFromIP(ip: string): Promise<LocationData | null> {
  try {
    // Skip localhost/private IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        city: 'Localhost',
        countryCode: 'LC',
        region: 'DEV',
        timezone: 'UTC'
      };
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,city,timezone`);
    const data = await response.json();

    if (data.status === 'fail') {
      console.error('Geolocation API error:', data.message);
      return null;
    }

    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      countryCode: data.countryCode || 'XX',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'UTC'
    };
  } catch (error) {
    console.error('Failed to fetch geolocation:', error);
    return null;
  }
}

/**
 * Mask IP address for privacy (show only last 4 digits)
 * Example: 192.168.1.100 -> ***.***.***.100
 */
export function maskIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `***.***.***.${parts[3]}`;
  }
  // For IPv6, show last segment
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 1) {
    return `***:***:***:${ipv6Parts[ipv6Parts.length - 1]}`;
  }
  return '***';
}
