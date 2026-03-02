import { ICourseRepository } from '../../core/ports/ICourseRepository';
import { Course, CourseQueryParams } from '../../core/entities/Course';
import redis from '../../lib/redis';

const TTL = 60 * 5; 

function makeKey(parts: Record<string, any>) {
  return 'course:' + Object.entries(parts)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join(':');
}

export class CachedCourseRepository implements ICourseRepository {
  constructor(private repo: ICourseRepository) {}

  async findMany(params: CourseQueryParams): Promise<Course[]> {
    const key = makeKey({ list: 1, ...params });
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log(' Cache HIT:', key);
        return JSON.parse(cached);
      }
    } catch {}

    const data = await this.repo.findMany(params);
    try { await redis.setex(key, TTL, JSON.stringify(data)); } catch {}
    return data;
  }

  async count(params: Pick<CourseQueryParams, 'search' | 'level'>): Promise<number> {
    const key = makeKey({ count: 1, ...params });
    try {
      const cached = await redis.get(key);
      if (cached) return parseInt(cached);
    } catch {}

    const count = await this.repo.count(params);
    try { await redis.setex(key, TTL, count.toString()); } catch {}
    return count;
  }

  async findById(id: string): Promise<Course | null> {
    const key = `course:id=${id}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log(' Cache HIT:', key);
        return JSON.parse(cached);
      }
    } catch {}

    const data = await this.repo.findById(id);
    if (data) {
      try { await redis.setex(key, TTL, JSON.stringify(data)); } catch {}
    }
    return data;
  }

  async create(data: any): Promise<Course> {
    const result = await this.repo.create(data);
    try {
      const keys = await redis.keys('course:list*');
      const countKeys = await redis.keys('course:count*');
      if (keys.length) await redis.del(...keys);
      if (countKeys.length) await redis.del(...countKeys);
      console.log(' Cache invalidated after create');
    } catch {}
    return result;
  }

  async update(id: string, data: any): Promise<Course> {
    const result = await this.repo.update(id, data);
    try {
      const keys = await redis.keys('course:*');
      if (keys.length) await redis.del(...keys);
      console.log(' Cache invalidated after update');
    } catch {}
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
    try {
      const keys = await redis.keys('course:*');
      if (keys.length) await redis.del(...keys);
      console.log(' Cache invalidated after delete');
    } catch {}
  }
}