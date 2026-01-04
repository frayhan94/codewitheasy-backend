import { Context, Next } from 'hono';

// Completely disable CORS - allow all origins
export const corsMiddleware = async (c: Context, next: Next) => {
  // Allow all origins
  c.header('Access-Control-Allow-Origin', '*');
  
  // Allow all methods
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  
  // Allow all headers
  c.header('Access-Control-Allow-Headers', '*');
  
  // Allow credentials
  c.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  
  await next();
};
