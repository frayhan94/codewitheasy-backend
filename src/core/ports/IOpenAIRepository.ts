import { OpenAIBalanceData } from '../entities/OpenAI';

export interface IOpenAIRepository {
  validateApiKey(): Promise<boolean>;
  getBalanceData(): Promise<OpenAIBalanceData>;
}