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

    // Get subscription info from OpenAI API
    const subscriptionResponse = await fetch('https://api.openai.com/v1/dashboard/billing/subscription', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!subscriptionResponse.ok) {
      throw new Error(`Failed to fetch subscription: ${subscriptionResponse.status}`);
    }

    const subscriptionData = await subscriptionResponse.json() as any;

    // Get usage info from OpenAI API
    const usageResponse = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!usageResponse.ok) {
      throw new Error(`Failed to fetch usage: ${usageResponse.status}`);
    }

    const usageData = await usageResponse.json() as any;

    // Calculate remaining quota
    const hardLimitUSD = subscriptionData.hard_limit_usd || 0;
    const totalUsageUSD = usageData.total_usage || 0;
    const remainingUSD = hardLimitUSD - totalUsageUSD;
    const usagePercentage = hardLimitUSD > 0 ? (totalUsageUSD / hardLimitUSD) * 100 : 0;

    return c.json({
      success: true,
      data: {
        totalUsageUSD: parseFloat(totalUsageUSD.toFixed(4)),
        hardLimitUSD: parseFloat(hardLimitUSD.toFixed(4)),
        remainingUSD: parseFloat(remainingUSD.toFixed(4)),
        usagePercentage: parseFloat(usagePercentage.toFixed(2)),
        currency: 'USD',
        period: subscriptionData.access_until ? `Until ${new Date(subscriptionData.access_until).toLocaleDateString()}` : 'No end date',
        planName: subscriptionData.plan_name || 'Unknown',
        hasPaymentMethod: subscriptionData.has_payment_method || false,
        lastChecked: new Date().toISOString(),
        // Current month usage breakdown
        currentMonthUsage: usageData.total_usage || 0,
        // Usage breakdown by date (last 100 days)
        dailyCosts: usageData.daily_costs || [],
      }
    });
  } catch (error: any) {
    console.error('Error checking OpenAI balance:', error);
    
    // Check if it's an authentication error
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
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
