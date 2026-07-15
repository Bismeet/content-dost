import { IncomingMessage, ServerResponse } from 'http';
import { validateOrigin } from './origin.js';

export function handleCors(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers.origin;
  
  if (origin && validateOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return true;
  }

  return false;
}
