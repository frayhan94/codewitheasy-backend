import { Hono } from 'hono';
import { CodeSandboxAdapter } from '../adapters/exernal/CodeSandboxAdapter';
import { CodeSandboxUseCase } from '../core/use-cases/CodeSandboxUseCase';

const codesandbox = new Hono();

// Initialize dependencies
const codeSandboxAdapter = new CodeSandboxAdapter();
const codeSandboxUseCase = new CodeSandboxUseCase(codeSandboxAdapter);

codesandbox.post('/create', async (c) => {
  try {
    const body = await c.req.json();
    
    const result = await codeSandboxUseCase.create(body);
    
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'Code must be a non-empty string') {
      return c.json({ success: false, error: error.message }, 400);
    }
    return c.json({ success: false, error: 'Failed to create sandbox' }, 500);
  }
});

export default codesandbox;