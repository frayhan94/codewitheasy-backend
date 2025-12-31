import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const subscriptions = new Hono();

subscriptions.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const [data, total] = await Promise.all([
      prisma.subscription.findMany({
        skip: offset,
        take: limit
      }),
      prisma.subscription.count()
    ]);
    
    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const data = await prisma.subscription.findUnique({
      where: { id }
    });
    
    if (!data) {
      return c.json({ error: 'Subscription not found' }, 404);
    }
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const data = await prisma.subscription.create({
      data: body
    });
    
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = await prisma.subscription.update({
      where: { id },
      data: body
    });
    
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.subscription.delete({
      where: { id }
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default subscriptions;
