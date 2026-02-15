import { ILessonRepository } from '../ports/ILessonRepository';
import { LessonQueryParams } from '../entities/Lesson';

export class LessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async getAll(params: LessonQueryParams) {
    const [data, total] = await Promise.all([
      this.lessonRepository.findMany(params),
      this.lessonRepository.count({ 
        search: params.search, 
        courseId: params.courseId, 
        moduleId: params.moduleId 
      })
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.lessonRepository.findById(id);
    
    if (!data) {
      throw new Error('Lesson not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.lessonRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.lessonRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.lessonRepository.delete(id);
    return { success: true };
  }
}