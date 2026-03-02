import { User, UserQueryParams } from '../entities/User';

export interface IUserRepository {
  findMany(params: UserQueryParams): Promise<User[]>;
  count(search?: string): Promise<number>;
  findById(id: string): Promise<User | null>;
  create(data: any): Promise<User>;
  update(id: string, data: any): Promise<User>;
  delete(id: string): Promise<void>;
}