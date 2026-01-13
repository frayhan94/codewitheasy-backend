import { Context, Next } from 'hono';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
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

  c.header('Vary', 'Origin');

  c.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );

  c.header(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type'
  );

  c.header('Access-Control-Allow-Credentials', 'true');

  // 🔑 INI KUNCI: preflight harus STOP DI SINI
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }

  await next();
};
