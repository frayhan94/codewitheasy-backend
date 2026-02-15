import { prisma } from '../../lib/prisma';
import { ILessonRepository } from '../../core/ports/ILessonRepository';
import { Lesson, LessonQueryParams } from '../../core/entities/Lesson';

export class PrismaLessonRepository implements ILessonRepository {
  async findMany(params: LessonQueryParams): Promise<any[]> {
    const { offset, limit, search, courseId, moduleId, sortBy, sortOrder } = params;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    if (courseId) {
      where.module = { courseId };
    }
    
    if (moduleId) {
      where.moduleId = moduleId;
    }
    
    // Build orderBy object
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    return await prisma.lesson.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        module: {
          include: {
            course: true
          }
        }
      },
      orderBy
    });
  }

  async count(params: Pick<LessonQueryParams, 'search' | 'courseId' | 'moduleId'>): Promise<number> {
    const { search, courseId, moduleId } = params;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    if (courseId) {
      where.module = { courseId };
    }
    
    if (moduleId) {
      where.moduleId = moduleId;
    }
    
    return await prisma.lesson.count({ where });
  }

  async findById(id: string): Promise<Lesson | null> {
    return await prisma.lesson.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Lesson> {
    return await prisma.lesson.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<Lesson> {
    return await prisma.lesson.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.lesson.delete({
      where: { id }
    });
  }
}