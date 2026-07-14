import { IncomingMessage } from 'http';

export async function readAndValidateJson(
  req: IncomingMessage & { body?: any },
  maxBytes: number
): Promise<any> {
  // 1. Validate Content-Type
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    const err = new Error('Unsupported Media Type. Must be application/json');
    (err as any).statusCode = 415;
    throw err;
  }

  // 2. Validate Content-Length header if present
  const contentLengthHeader = req.headers['content-length'];
  if (contentLengthHeader) {
    const size = parseInt(contentLengthHeader, 10);
    if (isNaN(size) || size > maxBytes) {
      const err = new Error('Payload Too Large');
      (err as any).statusCode = 413;
      throw err;
    }
  }

  // 3. Handle pre-parsed body (Vercel serverless helper automatically parses req.body)
  if (req.body !== undefined) {
    if (typeof req.body === 'object' && req.body !== null) {
      // Approximate size check for objects
      const strRepresentation = JSON.stringify(req.body);
      if (Buffer.byteLength(strRepresentation, 'utf8') > maxBytes) {
        const err = new Error('Payload Too Large');
        (err as any).statusCode = 413;
        throw err;
      }
      return req.body;
    }

    if (typeof req.body === 'string') {
      if (Buffer.byteLength(req.body, 'utf8') > maxBytes) {
        const err = new Error('Payload Too Large');
        (err as any).statusCode = 413;
        throw err;
      }
      try {
        return JSON.parse(req.body);
      } catch {
        const err = new Error('Invalid JSON');
        (err as any).statusCode = 400;
        throw err;
      }
    }
  }

  // 4. Fallback: stream reader for standard Node.js request stream (useful for Vitest/local testing)
  return new Promise((resolve, reject) => {
    let bodyStr = '';
    let bytesReceived = 0;

    req.on('data', (chunk: Buffer) => {
      bytesReceived += chunk.length;
      if (bytesReceived > maxBytes) {
        const err = new Error('Payload Too Large');
        (err as any).statusCode = 413;
        reject(err);
        return;
      }
      bodyStr += chunk.toString('utf8');
    });

    req.on('end', () => {
      // If we rejected earlier, don't attempt to resolve
      if (bytesReceived > maxBytes) return;

      try {
        const parsed = JSON.parse(bodyStr);
        resolve(parsed);
      } catch {
        const err = new Error('Invalid JSON');
        (err as any).statusCode = 400;
        reject(err);
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}
