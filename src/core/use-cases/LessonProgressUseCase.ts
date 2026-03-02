import { ILessonProgressRepository } from '../ports/ILessonProgressRepository';

export class LessonProgressUseCase {
  constructor(private lessonProgressRepository: ILessonProgressRepository) {}

  async getAll(offset: number, limit: number) {
    const [data, total] = await Promise.all([
      this.lessonProgressRepository.findMany(offset, limit),
      this.lessonProgressRepository.count()
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.lessonProgressRepository.findById(id);
    
    if (!data) {
      throw new Error('Lesson progress not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.lessonProgressRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.lessonProgressRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.lessonProgressRepository.delete(id);
    return { success: true };
  }
}