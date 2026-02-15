import { IBlogRepository } from "../ports/IBlogRepository";

export class BlogUseCase {
  constructor(private blogRepo: IBlogRepository) {}

  async listPosts(offset: number, limit: number, search?: string) {
    return await this.blogRepo.findAll({ offset, limit, search });
  }

  async getPost(id: string) {
    const post = await this.blogRepo.findById(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createPost(data: any) {
    return await this.blogRepo.create(data);
  }

  async updatePost(id: string, data: any) {
    return await this.blogRepo.update(id, data);
  }

  async deletePost(id: string) {
    return await this.blogRepo.delete(id);
  }
}