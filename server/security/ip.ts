import crypto from 'crypto';
import { IncomingMessage } from 'http';
import { getConfig } from '../config.js';

export function getClientIp(req: IncomingMessage): string {
  // 1. Prioritize x-vercel-forwarded-for
  const vercelIp = req.headers['x-vercel-forwarded-for'];
  if (vercelIp && typeof vercelIp === 'string') {
    const parts = vercelIp.split(',');
    const clientIp = parts[0]?.trim();
    if (clientIp) return clientIp;
  }

  // 2. Fallback to standard x-forwarded-for
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor && typeof xForwardedFor === 'string') {
    const parts = xForwardedFor.split(',');
    const clientIp = parts[0]?.trim();
    if (clientIp) return clientIp;
  }

  // 3. Fallback to x-real-ip
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp && typeof xRealIp === 'string') {
    return xRealIp.trim();
  }

  // 4. Remote address fallback
  return req.socket.remoteAddress || '127.0.0.1';
}

export function hashIp(ip: string): string {
  const config = getConfig();
  const secret = config.IP_HASH_SECRET;
  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}
