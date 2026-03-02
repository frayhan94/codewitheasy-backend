export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  progress: number;
}

export interface EnrollmentQueryParams {
  offset: number;
  limit: number;
  search?: string;
  sortBy: string;
  sortOrder: string;
}