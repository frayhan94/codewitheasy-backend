import { Subscription } from '../entities/Subscription';

export interface ISubscriptionRepository {
  findMany(offset: number, limit: number): Promise<Subscription[]>;
  count(): Promise<number>;
  findById(id: string): Promise<Subscription | null>;
  create(data: any): Promise<Subscription>;
  update(id: string, data: any): Promise<Subscription>;
  delete(id: string): Promise<void>;
}