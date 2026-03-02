import { Hono } from 'hono';
import { PrismaSubscriptionRepository } from '../adapters/db/PrismaSubscriptionRepository';
import { SubscriptionUseCase } from '../core/use-cases/SubscriptionUseCase';

const subscriptions = new Hono();

// Initialize dependencies
const subscriptionRepository = new PrismaSubscriptionRepository();
const subscriptionUseCase = new SubscriptionUseCase(subscriptionRepository);

subscriptions.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const result = await subscriptionUseCase.getAll(offset, limit);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await subscriptionUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Subscription not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await subscriptionUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await subscriptionUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

subscriptions.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await subscriptionUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default subscriptions;