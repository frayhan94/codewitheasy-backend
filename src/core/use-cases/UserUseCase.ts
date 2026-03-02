import { IUserRepository } from '../ports/IUserRepository';
import { UserQueryParams } from '../entities/User';

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async getAll(params: UserQueryParams) {
    const [data, total] = await Promise.all([
      this.userRepository.findMany(params),
      this.userRepository.count(params.search)
    ]);
    
    return { data, total };
  }

  async getById(id: string) {
    const data = await this.userRepository.findById(id);
    
    if (!data) {
      throw new Error('User not found');
    }
    
    return { data };
  }

  async create(body: any) {
    const data = await this.userRepository.create(body);
    return { data };
  }

  async update(id: string, body: any) {
    const data = await this.userRepository.update(id, body);
    return { data };
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
    return { success: true };
  }
}