export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: Date | null;
  timeSpent: number;
  lastAccessedAt: Date;
}