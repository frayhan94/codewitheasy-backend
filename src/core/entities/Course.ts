export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPremium: boolean;
  isPublished: boolean;
  isComingSoon: boolean;
  isFreeDemo: boolean;
  isShowNavbar: boolean;
  order: number;
  icon: string | null;
  benefits: any | null;
  level: CourseLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseQueryParams {
  offset: number;
  limit: number;
  search?: string;
  level?: string;
  sortBy: string;
  sortOrder: string;
}