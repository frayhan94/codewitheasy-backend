import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const lessonProgress = new Hono();

lessonProgress.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const { data, error, count } = await supabase
      .from('LessonProgress')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return c.json({ data, total: count });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('LessonProgress')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('LessonProgress')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('LessonProgress')
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

lessonProgress.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('LessonProgress')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessonProgress;
