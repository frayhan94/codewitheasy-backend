import OpenAI from 'openai';
import { IOpenAIRepository } from '../../core/ports/IOpenAIRepository';
import { OpenAIBalanceData } from '../../core/entities/OpenAI';

export class OpenAIAdapter implements IOpenAIRepository {
  private openaiClient: OpenAI;

  constructor() {
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  async validateApiKey(): Promise<boolean> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return false;
    }

    try {
      const modelsResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return modelsResponse.ok;
    } catch (error) {
      return false;
    }
  }

  async getBalanceData(): Promise<OpenAIBalanceData> {
    // Note: OpenAI billing endpoints require session keys from browser, not API keys
    // We provide mock data here as a fallback solution
    // In a real production environment, you would need to:
    // 1. Use OpenAI's webhook for usage tracking
    // 2. Implement your own usage tracking
    // 3. Use OpenAI's cost tracking API (if available for your account type)
    
    return {
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
    };
  }
}