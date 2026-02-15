import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { OpenAIAdapter } from '../adapters/ai/OpenAIAdapter';
import { OpenAIUseCase } from '../core/use-cases/OpenAIUseCase';

const openai = new Hono();

// Initialize dependencies
const openAIAdapter = new OpenAIAdapter();
const openAIUseCase = new OpenAIUseCase(openAIAdapter);

// CORS middleware
openai.use('*', cors());

// Check OpenAI API quota/usage
openai.get('/balance', async (c) => {
  try {
    const result = await openAIUseCase.checkBalance();
    return c.json(result);
  } catch (error: any) {
    console.error('Error checking OpenAI balance:', error);
    
    if (error.message === 'OpenAI API key not configured') {
      return c.json({
        success: false,
        error: error.message
      }, 500);
    }
    
    // Check if it's an authentication error
    if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message === 'Invalid API key') {
      return c.json({
        success: false,
        error: 'Invalid OpenAI API key',
        data: {
          totalUsageUSD: 0,
          hardLimitUSD: 0,
          remainingUSD: 0,
          usagePercentage: 0,
          lastChecked: new Date().toISOString()
        }
      }, 401);
    }
    
    return c.json({
      success: false,
      error: 'Failed to check OpenAI balance',
      details: error.message
    }, 500);
  }
});

export default openai;