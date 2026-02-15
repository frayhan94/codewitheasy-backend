import { GeminiUsageMetadata } from '../entities/Gemini';

export interface IGeminiRepository {
  listModels(): Promise<any[]>;
  generateContent(model: string, prompt: string): Promise<string>;
  checkBalance(model: string): Promise<GeminiUsageMetadata>;
}