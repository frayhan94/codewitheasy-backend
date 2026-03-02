import { ILessonFeedbackRepository } from '../ports/ILessonFeedbackRepository';
import { CreateLessonFeedbackRequest } from '../entities/LessonFeedback';

export class LessonFeedbackUseCase {
  constructor(private feedbackRepository: ILessonFeedbackRepository) {}

  async getFeedbackByLesson(lessonId: string) {
    const feedbackList = await this.feedbackRepository.findByLessonId(lessonId);
    
    return {
      success: true,
      data: feedbackList
    };
  }

  async getStatsByLesson(lessonId: string) {
    const stats = await this.feedbackRepository.getStatsByLessonId(lessonId);
    
    return {
      success: true,
      data: stats
    };
  }

  async getOverallStats() {
    const stats = await this.feedbackRepository.getOverallStats();
    
    return {
      success: true,
      data: stats
    };
  }

  async createOrUpdateFeedback(lessonId: string, request: CreateLessonFeedbackRequest) {
    const { userId, rating, comment, isHelpful, difficulty } = request;

    if (!userId || !rating) {
      throw new Error('userId and rating are required');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if feedback already exists
    const existingFeedback = await this.feedbackRepository.findByUserAndLesson(userId, lessonId);

    let feedback;
    if (existingFeedback) {
      // Update existing feedback
      feedback = await this.feedbackRepository.update(userId, lessonId, {
        rating,
        comment,
        isHelpful,
        difficulty
      });
    } else {
      // Create new feedback
      feedback = await this.feedbackRepository.create(lessonId, {
        userId,
        rating,
        comment,
        isHelpful,
        difficulty
      });
    }

    return {
      success: true,
      data: feedback
    };
  }
}