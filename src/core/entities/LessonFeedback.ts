export interface LessonFeedback {
  id: string;
  userId: string;
  lessonId: string;
  rating: number;
  comment: string | null;
  isHelpful: boolean | null;
  difficulty: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonFeedbackRequest {
  userId: string;
  rating: number;
  comment?: string;
  isHelpful?: boolean;
  difficulty?: string;
}

export interface LessonFeedbackStats {
  totalFeedback: number;
  averageRating: number;
  helpfulCount: number;
  difficultyDistribution: Record<string, number>;
}

export interface OverallFeedbackStats extends LessonFeedbackStats {
  lessonsGroupedByDifficulty: any[];
}