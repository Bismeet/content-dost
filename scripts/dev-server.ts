import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Manually parse environment variables for local execution (.env.local has priority over .env)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        const key = parts[0]?.trim();
        let value = parts.slice(1).join('=').trim();
        if (key) {
          // Normalize values
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          value = value.trim();

          // Only set if not already set (precedence: .env.local values set first)
          if (process.env[key] === undefined) {
            process.env[key] = value;
          }
        }
      }
    });
  }
}

// Load env.local first, then fallback to env
loadEnvFile(path.resolve(__dirname, '../.env.local'));
loadEnvFile(path.resolve(__dirname, '../.env'));

// 2. Import serverless endpoint handlers
import leadsHandler from '../api/leads.js';
import loginHandler from '../api/admin/login.js';
import logoutHandler from '../api/admin/logout.js';
import sessionHandler from '../api/admin/session.js';
import refreshHandler from '../api/admin/refresh.js';
import leadsListHandler from '../api/admin/leads/index.js';
import leadsStatsHandler from '../api/admin/leads/stats.js';
import leadsExportHandler from '../api/admin/leads/export.js';
import leadDetailHandler from '../api/admin/leads/[id].js';

// 3. Start local development server on port 3000
const server = http.createServer(async (req, res) => {
  // Set CORS headers for local Vite dev server
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(`[API Server] ${req.method} ${pathname}`);

  try {
    if (pathname === '/api/leads') {
      await leadsHandler(req, res);
    } else if (pathname === '/api/admin/login') {
      await loginHandler(req, res);
    } else if (pathname === '/api/admin/logout') {
      await logoutHandler(req, res);
    } else if (pathname === '/api/admin/session') {
      await sessionHandler(req, res);
    } else if (pathname === '/api/admin/refresh') {
      await refreshHandler(req, res);
    } else if (pathname === '/api/admin/leads/stats') {
      await leadsStatsHandler(req, res);
    } else if (pathname === '/api/admin/leads/export') {
      await leadsExportHandler(req, res);
    } else if (pathname === '/api/admin/leads') {
      await leadsListHandler(req, res);
    } else if (pathname.startsWith('/api/admin/leads/')) {
      // Dynamic route matching /api/admin/leads/:id
      await leadDetailHandler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
  } catch (error: any) {
    console.error(`[API Server Error] ${pathname}:`, error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: error?.message || 'Internal Server Error' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Local API development server running at http://localhost:${PORT}`);
  console.log(`Proxy your Vite app requests to this server for local testing.\n`);
});
