import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const certificates = new Hono();

certificates.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const { data, error, count } = await supabase
      .from('Certificate')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return c.json({ data, total: count });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('Certificate')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Certificate')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('Certificate')
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

certificates.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('Certificate')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default certificates;
