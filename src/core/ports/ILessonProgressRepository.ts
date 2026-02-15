import { LessonProgress } from '../entities/LessonProgress';

export interface ILessonProgressRepository {
  findMany(offset: number, limit: number): Promise<LessonProgress[]>;
  count(): Promise<number>;
  findById(id: string): Promise<LessonProgress | null>;
  create(data: any): Promise<LessonProgress>;
  update(id: string, data: any): Promise<LessonProgress>;
  delete(id: string): Promise<void>;
}