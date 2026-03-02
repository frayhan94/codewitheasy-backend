import { prisma } from '../../lib/prisma';
import { IEnrollmentRepository } from '../../core/ports/IEnrollmentRepository';
import { EnrollmentQueryParams } from '../../core/entities/Enrollment';

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  async findMany(params: EnrollmentQueryParams): Promise<any[]> {
    const { offset, limit, search, sortBy, sortOrder } = params;
    
    const where = search ? {
      OR: [
        { userId: { contains: search, mode: 'insensitive' as const } },
        { courseId: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    // Build orderBy object
    const orderBy: any = {};
    if (sortBy === 'course.title') {
      orderBy.course = { title: sortOrder };
    } else if (sortBy === 'user.firstName' || sortBy === 'user.lastName') {
      orderBy.user = { [sortBy.split('.')[1]]: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }
    
    return await prisma.enrollment.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        user: true,
        course: true
      },
      orderBy
    });
  }

  async count(search?: string): Promise<number> {
    const where = search ? {
      OR: [
        { userId: { contains: search, mode: 'insensitive' as const } },
        { courseId: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    return await prisma.enrollment.count({ where });
  }

  async findById(id: string): Promise<any | null> {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
        course: true
      }
    });
  }

  async create(data: any): Promise<any> {
    return await prisma.enrollment.create({
      data: data,
      include: {
        user: true,
        course: true
      }
    });
  }

  async update(id: string, data: any): Promise<any> {
    return await prisma.enrollment.update({
      where: { id },
      data: data,
      include: {
        user: true,
        course: true
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.enrollment.delete({
      where: { id }
    });
  }
}