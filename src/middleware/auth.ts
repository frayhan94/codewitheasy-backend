import { Context, Next } from 'hono';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log(
  'Auth middleware loaded - URL:',
  supabaseUrl ? 'SET' : 'NOT SET',
  'Service Role Key:',
  supabaseServiceRoleKey
    ? `SET (${supabaseServiceRoleKey.length} chars)`
    : 'NOT SET'
);

export const authMiddleware = async (c: Context, next: Next) => {
  // ✅ WAJIB: biarin preflight lewat
  if (c.req.method === 'OPTIONS') {
    return await next();
  }

  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (err) {
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};
