import { ICourseRepository } from '../ports/ICourseRepository';
import { CourseQueryParams } from '../entities/Course';

export class CourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async getAll(params: CourseQueryParams) {
    const [data, total] = await Promise.all([
      this.courseRepository.findMany(params),
      this.courseRepository.count({ search: params.search, level: params.level })
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.courseRepository.findById(id);
    
    if (!data) {
      throw new Error('Course not found');
    }
    
    return { data };
  }

  async create(body: any) {
    // Convert level to uppercase enum value if present
    if (body.level) {
      body.level = body.level.toUpperCase();
    }
    
    const data = await this.courseRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    // Convert level to uppercase enum value if present
    if (body.level) {
      body.level = body.level.toUpperCase();
    }
    
    const data = await this.courseRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.courseRepository.delete(id);
    return { success: true };
  }
}