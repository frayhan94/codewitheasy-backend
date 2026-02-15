import { Hono } from 'hono';
import { PrismaEnrollmentRepository } from '../adapters/db/PrismaEnrollmentRepository';
import { EnrollmentUseCase } from '../core/use-cases/EnrollmentUseCase';

const enrollments = new Hono();

// Initialize dependencies
const enrollmentRepository = new PrismaEnrollmentRepository();
const enrollmentUseCase = new EnrollmentUseCase(enrollmentRepository);

enrollments.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const result = await enrollmentUseCase.getAll({
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

enrollments.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await enrollmentUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Enrollment not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

enrollments.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await enrollmentUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await enrollmentUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

enrollments.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await enrollmentUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default enrollments;