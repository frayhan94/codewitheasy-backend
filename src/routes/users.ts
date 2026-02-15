import { Hono } from 'hono';
import { PrismaUserRepository } from '../adapters/db/PrismaUserRepository';
import { UserUseCase } from '../core/use-cases/UserUseCase';

const users = new Hono();

// Initialize dependencies
const userRepository = new PrismaUserRepository();
const userUseCase = new UserUseCase(userRepository);

users.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const result = await userUseCase.getAll({
      offset,
      limit,
      search,
      sortBy,
      sortOrder
    });
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await userUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await userUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await userUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await userUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default users;