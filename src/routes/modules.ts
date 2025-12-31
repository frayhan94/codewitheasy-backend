import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const modules = new Hono();

modules.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const courseId = c.req.query('courseId') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    const where: any = {};
    
    // Debug logging
    console.log('Modules API - Received params:', { search, courseId, sortBy, sortOrder });
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    if (courseId) {
      where.courseId = courseId;
    }
    
    console.log('Modules API - Final where clause:', where);
    
    // Build orderBy object
    const orderBy: any = {};
    if (sortBy === 'course.title') {
      orderBy.course = { title: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }
    
    console.log('Modules API - Final orderBy:', orderBy);
    
    const [data, total] = await Promise.all([
      prisma.module.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          course: true
        },
        orderBy
      }),
      prisma.module.count({ where })
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.module.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Module not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.module.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.module.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.module.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default modules;
