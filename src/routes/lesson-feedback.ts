import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaLessonFeedbackRepository } from '../adapters/db/PrismaLessonFeedbackRepository';
import { LessonFeedbackUseCase } from '../core/use-cases/LessonFeedbackUseCase';

const feedback = new Hono();

// Initialize dependencies
const feedbackRepository = new PrismaLessonFeedbackRepository();
const feedbackUseCase = new LessonFeedbackUseCase(feedbackRepository);

// CORS middleware
feedback.use('*', cors());

// Get feedback for a specific lesson
feedback.get('/lesson/:lessonId', async (c) => {
  try {
    const { lessonId } = c.req.param();
    
    const result = await feedbackUseCase.getFeedbackByLesson(lessonId);
    
    return c.json(result);
  } catch (error: any) {
    console.error('Error fetching lesson feedback:', error);
    return c.json({ 
      error: 'Failed to fetch lesson feedback', 
      details: error.message 
    }, 500);
  }
});

// Get feedback statistics for a lesson
feedback.get('/lesson/:lessonId/stats', async (c) => {
  try {
    const { lessonId } = c.req.param();
    
    const result = await feedbackUseCase.getStatsByLesson(lessonId);
    
    return c.json(result);
  } catch (error: any) {
    console.error('Error fetching feedback stats:', error);
    return c.json({ 
      error: 'Failed to fetch feedback statistics', 
      details: error.message 
    }, 500);
  }
});

// Get overall feedback statistics for dashboard
feedback.get('/stats', async (c) => {
  try {
    const result = await feedbackUseCase.getOverallStats();
    
    return c.json(result);
  } catch (error: any) {
    console.error('Error fetching overall feedback stats:', error);
    return c.json({ 
      error: 'Failed to fetch overall feedback statistics', 
      details: error.message 
    }, 500);
  }
});

// Create feedback for a lesson
feedback.post('/lesson/:lessonId', async (c) => {
  try {
    const { lessonId } = c.req.param();
    const body = await c.req.json();
    
    const result = await feedbackUseCase.createOrUpdateFeedback(lessonId, body);
    
    return c.json(result);
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    if (error.message === 'userId and rating are required' || error.message === 'Rating must be between 1 and 5') {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ 
      error: 'Failed to create feedback', 
      details: error.message 
    }, 500);
  }
});

export default feedback;