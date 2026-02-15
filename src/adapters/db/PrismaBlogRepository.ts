import { prisma } from '../../lib/prisma';
import { IBlogRepository } from '../../core/ports/IBlogRepository';
import { BlogPost } from '../../core/entities/BlogPost';

export class PrismaBlogRepository implements IBlogRepository {
  async findAll({ offset, limit, search }: { offset: number; limit: number; search?: string }) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.blogPost.count({ where })
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return await prisma.blogPost.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.blogPost.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.blogPost.update({ where: { id }, data });
  }

  async delete(id: string) {
    await prisma.blogPost.delete({ where: { id } });
  }
}