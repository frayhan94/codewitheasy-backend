import { Module, ModuleQueryParams } from '../entities/Module';

export interface IModuleRepository {
  findMany(params: ModuleQueryParams): Promise<any[]>;
  count(params: Pick<ModuleQueryParams, 'search' | 'courseId'>): Promise<number>;
  findById(id: string): Promise<Module | null>;
  create(data: any): Promise<Module>;
  update(id: string, data: any): Promise<Module>;
  delete(id: string): Promise<void>;
}