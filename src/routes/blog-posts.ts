import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const blogPosts = new Hono();

// GET all blog posts (List)
blogPosts.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
        { category: { contains: search, mode: 'insensitive' as const } }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.blogPost.count({ where })
    ]);

    return c.json({ data, total });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET single blog post (Show/Edit)
blogPosts.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await prisma.blogPost.findUnique({ where: { id } });
    
    if (!data) return c.json({ error: 'Post not found' }, 404);
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST new blog post (Create)
blogPosts.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = await prisma.blogPost.create({ data: body });
    return c.json({ data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// PUT update blog post (Edit)
blogPosts.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = await prisma.blogPost.update({
      where: { id },
      data: body
    });
    return c.json({ data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// DELETE blog post
blogPosts.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await prisma.blogPost.delete({ where: { id } });
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default blogPosts;