import { prisma } from '../../lib/prisma';
import { ICertificateRepository } from '../../core/ports/ICertificateRepository';
import { Certificate } from '../../core/entities/Certificate';

export class PrismaCertificateRepository implements ICertificateRepository {
  async findMany(offset: number, limit: number): Promise<Certificate[]> {
    return await prisma.certificate.findMany({
      skip: offset,
      take: limit
    });
  }

  async count(): Promise<number> {
    return await prisma.certificate.count();
  }

  async findById(id: string): Promise<Certificate | null> {
    return await prisma.certificate.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<Certificate> {
    return await prisma.certificate.create({
      data: data
    });
  }

  async update(id: string, data: any): Promise<Certificate> {
    return await prisma.certificate.update({
      where: { id },
      data: data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.certificate.delete({
      where: { id }
    });
  }
}