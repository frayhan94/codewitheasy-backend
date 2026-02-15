import { LessonFeedback, LessonFeedbackStats } from '../entities/LessonFeedback';

export interface ILessonFeedbackRepository {
  findByLessonId(lessonId: string): Promise<any[]>;
  getStatsByLessonId(lessonId: string): Promise<LessonFeedbackStats>;
  getOverallStats(): Promise<any>;
  findByUserAndLesson(userId: string, lessonId: string): Promise<LessonFeedback | null>;
  create(lessonId: string, data: any): Promise<any>;
  update(userId: string, lessonId: string, data: any): Promise<any>;
}