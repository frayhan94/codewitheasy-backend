import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const users = new Hono();

users.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    let query = supabase
      .from('User')
      .select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,firstName.ilike.%${search}%,lastName.ilike.%${search}%,clerkId.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return c.json({ data, total: count });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('User')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('User')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default users;
