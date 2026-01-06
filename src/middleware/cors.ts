import { Context, Next } from 'hono';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://admin-codewitheasy.vercel.app',
  'https://admin.codewitheasy.com',
];

export const corsMiddleware = async (c: Context, next: Next) => {
  const origin = c.req.header('origin');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
  }

  c.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );

  // ⬇️ INI KUNCINYA
  c.header(
    'Access-Control-Allow-Headers',
    c.req.header('access-control-request-headers') || 'Authorization, Content-Type'
  );

  c.header('Access-Control-Allow-Credentials', 'true');

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }

  await next();
};
