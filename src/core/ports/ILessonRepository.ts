import { Lesson, LessonQueryParams } from '../entities/Lesson';

export interface ILessonRepository {
  findMany(params: LessonQueryParams): Promise<any[]>;
  count(params: Pick<LessonQueryParams, 'search' | 'courseId' | 'moduleId'>): Promise<number>;
  findById(id: string): Promise<Lesson | null>;
  create(data: any): Promise<Lesson>;
  update(id: string, data: any): Promise<Lesson>;
  delete(id: string): Promise<void>;
}