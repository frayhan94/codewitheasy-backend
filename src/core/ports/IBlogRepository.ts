import { BlogPost } from "../entities/BlogPost";

export interface IBlogRepository {
  findAll(params: { offset: number; limit: number; search?: string }): Promise<{ data: BlogPost[], total: number }>;
  findById(id: string): Promise<BlogPost | null>;
  create(data: any): Promise<BlogPost>;
  update(id: string, data: any): Promise<BlogPost>;
  delete(id: string): Promise<void>;
}