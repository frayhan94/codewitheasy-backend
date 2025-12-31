import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const lessonProgress = new Hono();

lessonProgress.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const [data, total] = await Promise.all([
      prisma.lessonProgress.findMany({
        skip: offset,
        take: limit
      }),
      prisma.lessonProgress.count()
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.lessonProgress.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Lesson progress not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.lessonProgress.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.lessonProgress.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.lessonProgress.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessonProgress;
