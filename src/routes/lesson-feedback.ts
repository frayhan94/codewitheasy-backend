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

// Get overall feedback statistics for dashboard
feedback.get('/stats', async (c) => {
  try {
    console.log('Fetching overall feedback stats...');
    
    const [totalFeedback, avgRating, helpfulCount, difficultyStats, lessonsByDifficulty] = await Promise.all([
      prisma.lessonFeedback.count(),
      prisma.lessonFeedback.aggregate({
        _avg: {
          rating: true
        }
      }),
      prisma.lessonFeedback.count({
        where: { 
          isHelpful: true 
        }
      }),
      prisma.lessonFeedback.groupBy({
        by: ['difficulty'],
        where: { 
          difficulty: { not: null }
        },
        _count: true
      }),
      prisma.lessonFeedback.groupBy({
        by: ['lessonId', 'difficulty'],
        where: { 
          difficulty: { not: null }
        },
        _count: true,
        _avg: {
          rating: true
        }
      })
    ]);

    console.log('Raw data fetched:', { totalFeedback, difficultyStats, lessonsByDifficulty });

    const difficultyDistribution = difficultyStats.reduce((acc: any, stat: any) => {
      acc[stat.difficulty || 'unknown'] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    // Group lessons by difficulty with user details
    const lessonsGroupedByDifficulty = await Promise.all(
      Object.entries(
        lessonsByDifficulty.reduce((acc: any, item: any) => {
          if (!acc[item.difficulty]) {
            acc[item.difficulty] = [];
          }
          acc[item.difficulty].push(item.lessonId);
          return acc;
        }, {})
      ).map(async ([difficulty, lessonIds]) => {
        console.log(`Processing difficulty: ${difficulty}, lessonIds:`, lessonIds);
        
        const lessons = await prisma.lesson.findMany({
          where: {
            id: { in: lessonIds as string[] }
          },
          include: {
            module: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true
                  }
                }
              }
            },
            feedback: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              },
              where: {
                difficulty: difficulty
              }
            }
          }
        });

        console.log(`Found ${lessons.length} lessons for difficulty ${difficulty}`);

        return {
          difficulty,
          lessons: lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            course: lesson.module?.course || null,
            feedbackCount: lesson.feedback ? lesson.feedback.length : 0,
            averageRating: lesson.feedback && lesson.feedback.length > 0 
              ? lesson.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / lesson.feedback.length 
              : 0,
            users: lesson.feedback ? lesson.feedback.map(f => f.user) : []
          }))
        };
      })
    );

    return c.json({ 
      success: true, 
      data: {
        totalFeedback,
        averageRating: avgRating._avg.rating || 0,
        helpfulCount,
        difficultyDistribution,
        lessonsGroupedByDifficulty
      }
    });
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
