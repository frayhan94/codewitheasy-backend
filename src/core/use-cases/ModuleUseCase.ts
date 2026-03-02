import { IModuleRepository } from '../ports/IModuleRepository';
import { ModuleQueryParams } from '../entities/Module';

export class ModuleUseCase {
  constructor(private moduleRepository: IModuleRepository) {}

  async getAll(params: ModuleQueryParams) {
    const [data, total] = await Promise.all([
      this.moduleRepository.findMany(params),
      this.moduleRepository.count({ search: params.search, courseId: params.courseId })
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.moduleRepository.findById(id);
    
    if (!data) {
      throw new Error('Module not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.moduleRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.moduleRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.moduleRepository.delete(id);
    return { success: true };
  }
}