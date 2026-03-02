import { ISubscriptionRepository } from '../ports/ISubscriptionRepository';

export class SubscriptionUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async getAll(offset: number, limit: number) {
    const [data, total] = await Promise.all([
      this.subscriptionRepository.findMany(offset, limit),
      this.subscriptionRepository.count()
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.subscriptionRepository.findById(id);
    
    if (!data) {
      throw new Error('Subscription not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.subscriptionRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.subscriptionRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.subscriptionRepository.delete(id);
    return { success: true };
  }
}