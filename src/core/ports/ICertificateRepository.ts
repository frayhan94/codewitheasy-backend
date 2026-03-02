import { Certificate } from '../entities/Certificate';

export interface ICertificateRepository {
  findMany(offset: number, limit: number): Promise<Certificate[]>;
  count(): Promise<number>;
  findById(id: string): Promise<Certificate | null>;
  create(data: any): Promise<Certificate>;
  update(id: string, data: any): Promise<Certificate>;
  delete(id: string): Promise<void>;
}