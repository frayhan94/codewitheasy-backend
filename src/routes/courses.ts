import { Hono } from 'hono';
import { PrismaCourseRepository } from '../adapters/db/PrismaCourseRepository';
import { CourseUseCase } from '../core/use-cases/CourseUseCase';

const courses = new Hono();

// Initialize dependencies
const courseRepository = new PrismaCourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);

courses.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const level = c.req.query('level') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const result = await courseUseCase.getAll({
      offset,
      limit,
      search,
      level,
      sortBy,
      sortOrder
    });
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await courseUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Course not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

courses.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await courseUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await courseUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

courses.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await courseUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default courses;