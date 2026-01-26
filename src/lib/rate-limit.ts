type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
};

type RateLimitResult = {
  remaining: number;
  resetTime: number;
  success: boolean;
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 60000 },
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
      success: true,
    };
  }

  if (entry.count >= config.maxAttempts) {
    return {
      remaining: 0,
      resetTime: entry.resetTime,
      success: false,
    };
  }

  entry.count++;
  return {
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
    success: true,
  };
}

export function getRateLimitKey(identifier: string, action: string): string {
  return `${action}:${identifier}`;
}
