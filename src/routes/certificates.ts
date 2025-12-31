import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const certificates = new Hono();

certificates.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const [data, total] = await Promise.all([
      prisma.certificate.findMany({
        skip: offset,
        take: limit
      }),
      prisma.certificate.count()
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.certificate.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Certificate not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.certificate.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.certificate.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.certificate.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default certificates;
