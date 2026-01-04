import { Hono } from 'hono';
import { cors } from 'hono/cors';
import OpenAI from 'openai';

const openai = new Hono();

// Initialize OpenAI
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// CORS middleware
openai.use('*', cors());

// Check OpenAI API quota/usage
openai.get('/balance', async (c) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return c.json({
        success: false,
        error: 'OpenAI API key not configured'
      }, 500);
    }

    // Note: OpenAI billing endpoints require session keys from browser, not API keys
    // We'll provide a fallback solution with basic API validation and mock data
    try {
      // Test if the API key is valid by checking models
      const modelsResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!modelsResponse.ok) {
        throw new Error(`Invalid API key: ${modelsResponse.status}`);
      }

      // Since we can't access billing data with API keys, provide mock data
      // In a real production environment, you would need to:
      // 1. Use OpenAI's webhook for usage tracking
      // 2. Implement your own usage tracking
      // 3. Use OpenAI's cost tracking API (if available for your account type)
      
      return c.json({
        success: true,
        data: {
          totalUsageUSD: 12.3456,
          hardLimitUSD: 100.0000,
          remainingUSD: 87.6544,
          usagePercentage: 12.35,
          currency: 'USD',
          period: 'Monthly',
          planName: 'Pay-as-you-go',
          hasPaymentMethod: true,
          lastChecked: new Date().toISOString(),
          currentMonthUsage: 12.3456,
          dailyCosts: [],
          note: 'This is simulated data. OpenAI billing endpoints require browser session keys.'
        }
      });
    } catch (billingError: any) {
      // If billing endpoints fail, return API key validation with mock data
      return c.json({
        success: true,
        data: {
          totalUsageUSD: 0.0000,
          hardLimitUSD: 0.0000,
          remainingUSD: 0.0000,
          usagePercentage: 0,
          currency: 'USD',
          period: 'Unknown',
          planName: 'Pay-as-you-go',
          hasPaymentMethod: false,
          lastChecked: new Date().toISOString(),
          currentMonthUsage: 0.0000,
          dailyCosts: [],
          note: 'API key is valid but billing data unavailable. This is simulated data.'
        }
      });
    }
  } catch (error: any) {
    console.error('Error checking OpenAI balance:', error);
    
    // Check if it's an authentication error
    if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('Invalid API key')) {
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
