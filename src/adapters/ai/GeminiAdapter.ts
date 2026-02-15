import { GoogleGenerativeAI } from '@google/generative-ai';
import { IGeminiRepository } from '../../core/ports/IGeminiRepository';
import { GeminiUsageMetadata } from '../../core/entities/Gemini';

export class GeminiAdapter implements IGeminiRepository {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async listModels(): Promise<any[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json() as any;
    return data.models || [];
  }

  async generateContent(modelName: string, prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async checkBalance(modelName: string): Promise<GeminiUsageMetadata> {
    const model = this.genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello');
    const response = result.response;
    return response.usageMetadata || {};
  }
}