import { prisma } from '../../lib/prisma';
import { IModuleRepository } from '../../core/ports/IModuleRepository';
import { Module, ModuleQueryParams } from '../../core/entities/Module';

export class PrismaModuleRepository implements IModuleRepository {
  async findMany(params: ModuleQueryParams): Promise<any[]> {
    const { offset, limit, search, courseId, sortBy, sortOrder } = params;
    
    const where: any = {};
    
    // Debug logging
  
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    if (courseId) {
      where.courseId = courseId;
    }

    
    // Build orderBy object
    const orderBy: any = {};
    if (sortBy === 'course.title') {
      orderBy.course = { title: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }
    
    return await prisma.module.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        course: true
      },
      orderBy
    });
  }

  async count(params: Pick<ModuleQueryParams, 'search' | 'courseId'>): Promise<number> {
    const { search, courseId } = params;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    if (courseId) {
      where.courseId = courseId;
    }
    
    return await prisma.module.count({ where });
  }

  async findById(id: string): Promise<Module | null> {
    return await prisma.module.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Module> {
    return await prisma.module.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<Module> {
    return await prisma.module.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.module.delete({
      where: { id }
    });
  }
}