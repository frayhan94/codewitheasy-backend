import { Hono } from 'hono';
import { PrismaLessonProgressRepository } from '../adapters/db/PrismaLessonProgressRepository';
import { LessonProgressUseCase } from '../core/use-cases/LessonProgressUseCase';

const lessonProgress = new Hono();

// Initialize dependencies
const lessonProgressRepository = new PrismaLessonProgressRepository();
const lessonProgressUseCase = new LessonProgressUseCase(lessonProgressRepository);

lessonProgress.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const result = await lessonProgressUseCase.getAll(offset, limit);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await lessonProgressUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Lesson progress not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await lessonProgressUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await lessonProgressUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

lessonProgress.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await lessonProgressUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default lessonProgress;