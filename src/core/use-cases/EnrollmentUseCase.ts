import { IEnrollmentRepository } from '../ports/IEnrollmentRepository';
import { EnrollmentQueryParams } from '../entities/Enrollment';

export class EnrollmentUseCase {
  constructor(private enrollmentRepository: IEnrollmentRepository) {}

  async getAll(params: EnrollmentQueryParams) {
    const [data, total] = await Promise.all([
      this.enrollmentRepository.findMany(params),
      this.enrollmentRepository.count(params.search)
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.enrollmentRepository.findById(id);
    
    if (!data) {
      throw new Error('Enrollment not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.enrollmentRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.enrollmentRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.enrollmentRepository.delete(id);
    return { success: true };
  }
}