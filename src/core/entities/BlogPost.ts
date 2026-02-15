export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
}