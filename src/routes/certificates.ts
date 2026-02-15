import { Hono } from 'hono';
import { PrismaCertificateRepository } from '../adapters/db/PrismaCertificateRepository';
import { CertificateUseCase } from '../core/use-cases/CertificateUseCase';

const certificates = new Hono();

// Initialize dependencies
const certificateRepository = new PrismaCertificateRepository();
const certificateUseCase = new CertificateUseCase(certificateRepository);

certificates.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    
    const result = await certificateUseCase.getAll(offset, limit);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await certificateUseCase.getById(id);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Certificate not found') {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: error.message }, 500);
  }
});

certificates.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await certificateUseCase.create(body);
    
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const result = await certificateUseCase.update(id, body);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

certificates.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await certificateUseCase.delete(id);
    
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default certificates;