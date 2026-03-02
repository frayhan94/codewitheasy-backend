import { Hono } from 'hono';
import { PrismaLessonRepository } from '../adapters/db/PrismaLessonRepository';
import { LessonUseCase } from '../core/use-cases/LessonUseCase';

const lessons = new Hono();

// Initialize dependencies
const lessonRepository = new PrismaLessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);

lessons.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const courseId = c.req.query('courseId') || '';
    const moduleId = c.req.query('moduleId') || '';
    const sortBy = c.req.query('sortBy') || 'id';
    const sortOrder = c.req.query('sortOrder') || 'asc';
    
    const result = await lessonUseCase.getAll({
      offset,
      limit,
      search,
      courseId,
      moduleId,
      sortBy,
      sortOrder
    });
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await lessonUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Lesson not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

lessons.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await lessonUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await lessonUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessons.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await lessonUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessons;