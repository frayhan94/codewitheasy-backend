export interface Module {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleQueryParams {
  offset: number;
  limit: number;
  search?: string;
  courseId?: string;
  sortBy: string;
  sortOrder: string;
}