import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const enrollments = new Hono();

enrollments.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const where = search ? {
      OR: [
        { userId: { contains: search, mode: 'insensitive' as const } },
        { courseId: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    // Build orderBy object
    const orderBy: any = {};
    if (sortBy === 'course.title') {
      orderBy.course = { title: sortOrder };
    } else if (sortBy === 'user.firstName' || sortBy === 'user.lastName') {
      orderBy.user = { [sortBy.split('.')[1]]: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }
    
    const [data, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          user: true,
          course: true
        },
        orderBy
      }),
      prisma.enrollment.count({ where })
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
        course: true
      }
    });
    
    if (!data) {
      return c.json({ error: 'Enrollment not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.enrollment.create({
      data: body,
      include: {
        user: true,
        course: true
      }
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.enrollment.update({
      where: { id },
      data: body,
      include: {
        user: true,
        course: true
      }
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.enrollment.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default enrollments;
