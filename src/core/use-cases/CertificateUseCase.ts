import { ICertificateRepository } from '../ports/ICertificateRepository';

export class CertificateUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async getAll(offset: number, limit: number) {
    const [data, total] = await Promise.all([
      this.certificateRepository.findMany(offset, limit),
      this.certificateRepository.count()
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.certificateRepository.findById(id);
    
    if (!data) {
      throw new Error('Certificate not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.certificateRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.certificateRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.certificateRepository.delete(id);
    return { success: true };
  }
}