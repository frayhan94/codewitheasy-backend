import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const lessons = new Hono();

lessons.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    const [data, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        skip: offset,
        take: limit
      }),
      prisma.lesson.count({ where })
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.lesson.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Lesson not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.lesson.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.lesson.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.lesson.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessons;
