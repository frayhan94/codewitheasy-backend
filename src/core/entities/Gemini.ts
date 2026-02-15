export interface GenerateDescriptionRequest {
  title: string;
  level: string;
  icon?: string;
}

export interface GenerateBenefitsRequest {
  title: string;
  level: string;
  description?: string;
  icon?: string;
}

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface GeminiBalanceData {
  requestsUsed: number | string;
  requestsRemaining: number | string;
  requestsLimit: string;
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
  lastChecked: string;
}