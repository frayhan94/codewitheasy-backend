import { Course, CourseQueryParams } from '../entities/Course';

export interface ICourseRepository {
  findMany(params: CourseQueryParams): Promise<Course[]>;
  count(params: Pick<CourseQueryParams, 'search' | 'level'>): Promise<number>;
  findById(id: string): Promise<Course | null>;
  create(data: any): Promise<Course>;
  update(id: string, data: any): Promise<Course>;
  delete(id: string): Promise<void>;
}