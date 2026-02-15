export interface OpenAIBalanceData {
  totalUsageUSD: number;
  hardLimitUSD: number;
  remainingUSD: number;
  usagePercentage: number;
  currency: string;
  period: string;
  planName: string;
  hasPaymentMethod: boolean;
  lastChecked: string;
  currentMonthUsage: number;
  dailyCosts: any[];
  note?: string;
}