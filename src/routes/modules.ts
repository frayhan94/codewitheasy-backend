import { Hono } from 'hono';
import { PrismaModuleRepository } from '../adapters/db/PrismaModuleRepository';
import { ModuleUseCase } from '../core/use-cases/ModuleUseCase';

const modules = new Hono();

// Initialize dependencies
const moduleRepository = new PrismaModuleRepository();
const moduleUseCase = new ModuleUseCase(moduleRepository);

modules.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const courseId = c.req.query('courseId') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const result = await moduleUseCase.getAll({
      offset,
      limit,
      search,
      courseId,
      sortBy,
      sortOrder
    });
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await moduleUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Module not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

modules.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await moduleUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await moduleUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

modules.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await moduleUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default modules;