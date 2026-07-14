import { ServerResponse } from 'http';
import { setSecurityHeaders } from '../security/headers.js';

export function sendJson(res: ServerResponse, statusCode: number, data: any) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function sendSuccess(
  res: ServerResponse,
  message: string,
  extra: Record<string, any> = {},
  statusCode = 200
) {
  sendJson(res, statusCode, {
    success: true,
    message,
    ...extra,
  });
}

export function sendError(
  res: ServerResponse,
  statusCode: number,
  message: string,
  details?: any
) {
  const payload: any = {
    success: false,
    message,
  };
  if (details !== undefined) {
    payload.details = details;
  }
  sendJson(res, statusCode, payload);
}

export function sendGenericError(res: ServerResponse, error?: any) {
  console.error('[Internal Error]', error);
  sendError(res, 500, 'An unexpected error occurred. Please try again.');
}
