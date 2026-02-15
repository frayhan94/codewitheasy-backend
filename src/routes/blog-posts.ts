import { Hono } from 'hono';
import { BlogUseCase } from '../core/use-cases/BlogUseCase';
import { PrismaBlogRepository } from '../adapters/db/PrismaBlogRepository';

const blogPosts = new Hono();
const blogRepo = new PrismaBlogRepository();
const blogUseCase = new BlogUseCase(blogRepo);

blogPosts.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    const result = await blogUseCase.listPosts(offset, limit, search);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

blogPosts.get('/:id', async (c) => {
  try {
    const data = await blogUseCase.getPost(c.req.param('id'));
    return c.json({ data });
  } catch (error: any) {
    const status = error.message === 'Post not found' ? 404 : 500;
    return c.json({ error: error.message }, status);
  }
});

blogPosts.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = await blogUseCase.createPost(body);
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

blogPosts.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = await blogUseCase.updatePost(id, body);
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

blogPosts.delete('/:id', async (c) => {
  try {
    await blogUseCase.deletePost(c.req.param('id'));
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default blogPosts;