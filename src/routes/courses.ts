import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const courses = new Hono();

courses.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    let query = supabase
      .from('Course')
      .select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return c.json({ data, total: count });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('Course')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Course')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Course')
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

courses.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('Course')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default courses;
