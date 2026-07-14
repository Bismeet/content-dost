import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getConfig } from '../config.js';

// Simple in-memory fallback for local development only
interface DevLimitRecord {
  timestamps: number[];
}
const devMemoryStore = new Map<string, DevLimitRecord>();

function checkDevLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = devMemoryStore.get(key) || { timestamps: [] };
  
  // Filter out expired timestamps
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
  
  if (record.timestamps.length >= limit) {
    return false;
  }
  
  record.timestamps.push(now);
  devMemoryStore.set(key, record);
  return true;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(
  key: string,
  limitType: 'lead-submit' | 'admin-login'
): Promise<RateLimitResult> {
  const config = getConfig();
  const isDev = config.NODE_ENV === 'development';

  // 1. If in development and Upstash is not configured, use in-memory fallback
  const isUpstashConfigured = config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN;
  
  if (isDev && !isUpstashConfigured) {
    // Lead submit dev limits
    if (limitType === 'lead-submit') {
      // 5 requests per 10 minutes
      const shortOk = checkDevLimit(`${key}:lead:10m`, 5, 10 * 60 * 1000);
      // 20 requests per day
      const longOk = checkDevLimit(`${key}:lead:24h`, 20, 24 * 60 * 60 * 1000);
      
      const success = shortOk && longOk;
      return {
        success,
        limit: 5,
        remaining: success ? 1 : 0,
        reset: Date.now() + 600000,
      };
    } else {
      // Admin login limit: 5 attempts per 15 minutes
      const success = checkDevLimit(`${key}:login:15m`, 5, 15 * 60 * 1000);
      return {
        success,
        limit: 5,
        remaining: success ? 1 : 0,
        reset: Date.now() + 900000,
      };
    }
  }

  // 2. In production (or if configured in dev), use Upstash Redis and fail-closed if unavailable
  if (!isUpstashConfigured) {
    throw new Error('Upstash Redis configuration is missing. Rate limiter failing closed.');
  }

  try {
    const redis = new Redis({
      url: config.UPSTASH_REDIS_REST_URL,
      token: config.UPSTASH_REDIS_REST_TOKEN,
    });

    if (limitType === 'lead-submit') {
      // We implement 2-tier limits: 5 requests per 10 mins AND 20 requests per 24 hours
      const limiter10m = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        analytics: true,
        prefix: 'cd:ratelimit:10m',
      });

      const limiter24h = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 d'),
        analytics: true,
        prefix: 'cd:ratelimit:24h',
      });

      const res10m = await limiter10m.limit(`${key}:10m`);
      if (!res10m.success) {
        return {
          success: false,
          limit: 5,
          remaining: res10m.remaining,
          reset: res10m.reset,
        };
      }

      const res24h = await limiter24h.limit(`${key}:24h`);
      return {
        success: res24h.success,
        limit: 20,
        remaining: res24h.remaining,
        reset: res24h.reset,
      };
    } else {
      // Admin login: 5 attempts per 15 minutes
      const limiterLogin = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'cd:ratelimit:login',
      });

      const res = await limiterLogin.limit(key);
      return {
        success: res.success,
        limit: 5,
        remaining: res.remaining,
        reset: res.reset,
      };
    }
  } catch (error) {
    // Log error, but DO NOT swallow. Fail closed in production.
    console.error('Rate limiting Redis error:', error);
    throw new Error('Security check unavailable');
  }
}
