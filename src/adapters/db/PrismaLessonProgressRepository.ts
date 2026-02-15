import { prisma } from '../../lib/prisma';
import { ILessonProgressRepository } from '../../core/ports/ILessonProgressRepository';
import { LessonProgress } from '../../core/entities/LessonProgress';

export class PrismaLessonProgressRepository implements ILessonProgressRepository {
  async findMany(offset: number, limit: number): Promise<LessonProgress[]> {
    return await prisma.lessonProgress.findMany({
      skip: offset,
      take: limit
    });
  }

  async count(): Promise<number> {
    return await prisma.lessonProgress.count();
  }

  async findById(id: string): Promise<LessonProgress | null> {
    return await prisma.lessonProgress.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<LessonProgress> {
    return await prisma.lessonProgress.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<LessonProgress> {
    return await prisma.lessonProgress.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.lessonProgress.delete({
      where: { id }
    });
  }
}