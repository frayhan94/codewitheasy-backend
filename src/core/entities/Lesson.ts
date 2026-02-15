export interface Lesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  description: string;
  content: any;
  duration: number;
  order: number;
  isPremium: boolean;
  videoUrl: string | null;
  resources: any | null;
  language: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonQueryParams {
  offset: number;
  limit: number;
  search?: string;
  courseId?: string;
  moduleId?: string;
  sortBy: string;
  sortOrder: string;
}