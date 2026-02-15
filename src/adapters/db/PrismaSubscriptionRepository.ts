import { prisma } from '../../lib/prisma';
import { ISubscriptionRepository } from '../../core/ports/ISubscriptionRepository';
import { Subscription } from '../../core/entities/Subscription';

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  async findMany(offset: number, limit: number): Promise<Subscription[]> {
    return await prisma.subscription.findMany({
      skip: offset,
      take: limit
    });
  }

  async count(): Promise<number> {
    return await prisma.subscription.count();
  }

  async findById(id: string): Promise<Subscription | null> {
    return await prisma.subscription.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Subscription> {
    return await prisma.subscription.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<Subscription> {
    return await prisma.subscription.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.subscription.delete({
      where: { id }
    });
  }
}