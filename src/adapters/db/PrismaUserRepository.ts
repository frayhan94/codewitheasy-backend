import { prisma } from '../../lib/prisma';
import { IUserRepository } from '../../core/ports/IUserRepository';
import { User, UserQueryParams } from '../../core/entities/User';

export class PrismaUserRepository implements IUserRepository {
  async findMany(params: UserQueryParams): Promise<User[]> {
    const { offset, limit, search, sortBy, sortOrder } = params;
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { clerkId: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    // Build orderBy object
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    return await prisma.user.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy
    });
  }

  async count(search?: string): Promise<number> {
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { clerkId: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};
    
    return await prisma.user.count({ where });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<User> {
    return await prisma.user.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}