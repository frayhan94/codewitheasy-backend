import { Context, Next } from 'hono';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174').split(',');

export const corsMiddleware = async (c: Context, next: Next) => {
  const origin = c.req.header('Origin') || '';
  
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    c.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Credentials', 'true');
  
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  
  await next();
};
