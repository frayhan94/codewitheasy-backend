export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  dailyMessageCount: number;
  monthlyMessageCount: number;
  lastMessageDate: Date | null;
  lastMonthReset: Date | null;
  subscriptionTier: string;
}

export interface UserQueryParams {
  offset: number;
  limit: number;
  search?: string;
  sortBy: string;
  sortOrder: string;
}