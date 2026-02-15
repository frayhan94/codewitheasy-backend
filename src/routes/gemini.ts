import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GeminiAdapter } from '../adapters/ai/GeminiAdapter';
import { GeminiUseCase } from '../core/use-cases/GeminiUseCase';

const gemini = new Hono();

// Initialize dependencies
const geminiAdapter = new GeminiAdapter();
const geminiUseCase = new GeminiUseCase(geminiAdapter);

// CORS middleware
gemini.use('*', cors());

// List available models
gemini.get('/models', async (c) => {
  try {
    const result = await geminiUseCase.listModels();
    return c.json(result);
  } catch (error: any) {
    console.error('Error listing models:', error);
    return c.json({
      error: 'Failed to list models',
      details: error.message
    }, 500);
  }
});

// Generate course description
gemini.post('/generate-description', async (c) => {
  try {
    const body = await c.req.json();
    const result = await geminiUseCase.generateDescription(body);
    return c.json(result);
  } catch (error: any) {
    console.error('Error generating description:', error);
    if (error.message === 'Title and level are required') {
      return c.json({ error: error.message }, 400);
    }
    return c.json({
      error: 'Failed to generate description',
      details: error.message
    }, 500);
  }
});

// Generate course benefits
gemini.post('/generate-benefits', async (c) => {
  try {
    const body = await c.req.json();
    const result = await geminiUseCase.generateBenefits(body);
    return c.json(result);
  } catch (error: any) {
    console.error('Error generating benefits:', error);
    if (error.message === 'Title and level are required') {
      return c.json({ error: error.message }, 400);
    }
    return c.json({
      error: 'Failed to generate benefits',
      details: error.message
    }, 500);
  }
});

// Check API balance/usage
gemini.get('/balance', async (c) => {
  try {
    const result = await geminiUseCase.checkBalance();
    return c.json(result);
  } catch (error: any) {
    console.error('Error checking Gemini balance:', error);
    
    // Check if it's a quota exceeded error
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return c.json({
        success: false,
        error: 'API quota exceeded or rate limit reached',
        data: {
          requestsUsed: 'Quota exceeded',
          requestsRemaining: 0,
          requestsLimit: 'Check Google AI Studio',
          lastChecked: new Date().toISOString()
        }
      }, 429);
    }

    if (error.message === 'Gemini API key not configured') {
      return c.json({
        success: false,
        error: error.message
      }, 500);
    }

    if (error.message === 'Usage metadata not available') {
      return c.json({
        success: false,
        error: error.message
      }, 500);
    }
    
    return c.json({
      success: false,
      error: 'Failed to check Gemini balance',
      details: error.message
    }, 500);
  }
});

export default gemini;