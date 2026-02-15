import { prisma } from '../../lib/prisma';
import { ILessonFeedbackRepository } from '../../core/ports/ILessonFeedbackRepository';
import { LessonFeedback, LessonFeedbackStats } from '../../core/entities/LessonFeedback';

export class PrismaLessonFeedbackRepository implements ILessonFeedbackRepository {
  async findByLessonId(lessonId: string): Promise<any[]> {
    return await prisma.lessonFeedback.findMany({
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
  }

  async getStatsByLessonId(lessonId: string): Promise<LessonFeedbackStats> {
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

    const difficultyDistribution = difficultyStats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat.difficulty || 'unknown'] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFeedback,
      averageRating: avgRating._avg.rating || 0,
      helpfulCount,
      difficultyDistribution
    };
  }

  async getOverallStats(): Promise<any> {
    
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

    const difficultyDistribution = difficultyStats.reduce((acc: Record<string, number>, stat: any) => {
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

        return {
          difficulty,
          lessons: lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            course: lesson.module?.course || null,
            feedbackCount: lesson.feedback ? lesson.feedback.length : 0,
            averageRating: lesson.feedback && lesson.feedback.length > 0 
              ? lesson.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / lesson.feedback.length 
              : 0,
            users: lesson.feedback ? lesson.feedback.map((f: any) => f.user) : []
          }))
        };
      })
    );

    return {
      totalFeedback,
      averageRating: avgRating._avg.rating || 0,
      helpfulCount,
      difficultyDistribution,
      lessonsGroupedByDifficulty
    };
  }

  async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonFeedback | null> {
    return await prisma.lessonFeedback.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });
  }

  async create(lessonId: string, data: any): Promise<any> {
    return await prisma.lessonFeedback.create({
      data: {
        userId: data.userId,
        lessonId: lessonId,
        rating: data.rating,
        comment: data.comment,
        isHelpful: data.isHelpful,
        difficulty: data.difficulty
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

  async update(userId: string, lessonId: string, data: any): Promise<any> {
    return await prisma.lessonFeedback.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      data: {
        rating: data.rating,
        comment: data.comment,
        isHelpful: data.isHelpful,
        difficulty: data.difficulty,
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
  }
}