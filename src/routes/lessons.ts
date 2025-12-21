import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const lessons = new Hono();

lessons.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    let query = supabase
      .from('Lesson')
      .select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return c.json({ data, total: count });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('Lesson')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Lesson')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Lesson')
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

lessons.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('Lesson')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessons;
