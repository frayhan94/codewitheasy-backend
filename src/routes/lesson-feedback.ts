import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prisma } from '../lib/prisma.js';

const feedback = new Hono();

// CORS middleware
feedback.use('*', cors());

// Get feedback for a specific lesson
feedback.get('/lesson/:lessonId', async (c) => {
  try {
    const { lessonId } = c.req.param();
    
    const feedbackList = await prisma.lessonFeedback.findMany({
      where: {
        lessonId: lessonId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({ 
      success: true, 
      data: feedbackList 
    });
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
    
    const [totalFeedback, avgRating, helpfulCount, difficultyStats] = await Promise.all([
      prisma.lessonFeedback.count({
        where: { lessonId }
      }),
      prisma.lessonFeedback.aggregate({
        where: { lessonId },
        _avg: {
          rating: true
        }
      }),
      prisma.lessonFeedback.count({
        where: { 
          lessonId,
          isHelpful: true 
        }
      }),
      prisma.lessonFeedback.groupBy({
        by: ['difficulty'],
        where: { 
          lessonId,
          difficulty: { not: null }
        },
        _count: true
      })
    ]);

    const difficultyDistribution = difficultyStats.reduce((acc, stat) => {
      acc[stat.difficulty || 'unknown'] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return c.json({ 
      success: true, 
      data: {
        totalFeedback,
        averageRating: avgRating._avg.rating || 0,
        helpfulCount,
        difficultyDistribution
      }
    });
  } catch (error: any) {
    console.error('Error fetching feedback stats:', error);
    return c.json({ 
      error: 'Failed to fetch feedback statistics', 
      details: error.message 
    }, 500);
  }
});

// Create feedback for a lesson
feedback.post('/lesson/:lessonId', async (c) => {
  try {
    const { lessonId } = c.req.param();
    const { userId, rating, comment, isHelpful, difficulty } = await c.req.json();

    if (!userId || !rating) {
      return c.json({ error: 'userId and rating are required' }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    // Check if feedback already exists for this user-lesson pair
    const existingFeedback = await prisma.lessonFeedback.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });

    let feedback;
    if (existingFeedback) {
      // Update existing feedback
      feedback = await prisma.lessonFeedback.update({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        data: {
          rating,
          comment,
          isHelpful,
          difficulty,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    } else {
      // Create new feedback
      feedback = await prisma.lessonFeedback.create({
        data: {
          userId,
          lessonId,
          rating,
          comment,
          isHelpful,
          difficulty
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    }

    return c.json({ 
      success: true, 
      data: feedback 
    });
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    return c.json({ 
      error: 'Failed to create feedback', 
      details: error.message 
    }, 500);
  }
});

export default feedback;
