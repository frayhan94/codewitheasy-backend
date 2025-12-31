import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const courses = new Hono();

courses.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    // Build orderBy object
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          modules: {
            include: {
              lessons: true
            }
          }
        },
        orderBy
      }),
      prisma.course.count({ where })
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Course not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.course.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.course.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.course.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default courses;
