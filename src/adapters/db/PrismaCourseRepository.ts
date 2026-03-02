import { prisma } from '../../lib/prisma';
import { ICourseRepository } from '../../core/ports/ICourseRepository';
import { Course, CourseQueryParams } from '../../core/entities/Course';

export class PrismaCourseRepository implements ICourseRepository {
  async findMany(params: CourseQueryParams): Promise<Course[]> {
    const { offset, limit, search, level, sortBy, sortOrder } = params;
    
    const where: any = {};
    
    // Add search condition if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    // Add level filter if provided
    if (level) {
      where.level = level.toUpperCase();
    }
    
    // Build orderBy object
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    return await prisma.course.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      },
      orderBy
    });
  }

  async count(params: Pick<CourseQueryParams, 'search' | 'level'>): Promise<number> {
    const { search, level } = params;
    
    const where: any = {};
    
    // Add search condition if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } }
      ];
    }
    
    // Add level filter if provided
    if (level) {
      where.level = level.toUpperCase();
    }
    
    return await prisma.course.count({ where });
  }

  async findById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Course> {
    return await prisma.course.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id }
    });
  }
}