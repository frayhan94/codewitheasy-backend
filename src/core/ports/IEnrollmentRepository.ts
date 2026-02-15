import { Enrollment, EnrollmentQueryParams } from '../entities/Enrollment';

export interface IEnrollmentRepository {
  findMany(params: EnrollmentQueryParams): Promise<any[]>;
  count(search?: string): Promise<number>;
  findById(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}