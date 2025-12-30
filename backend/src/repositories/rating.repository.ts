/**
 * Rating Repository
 * Handles database operations for lesson ratings
 */

import { prisma } from './prisma';
import { Rating } from '@prisma/client';

export const ratingRepository = {
  /**
   * Find a rating by student and lesson
   */
  async findByStudentAndLesson(
    studentId: string,
    lessonId: string
  ): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
    });
  },

  /**
   * Create or update a rating
   */
  async upsert(
    studentId: string,
    lessonId: string,
    value: number
  ): Promise<Rating> {
    return prisma.rating.upsert({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
      update: {
        value,
      },
      create: {
        studentId,
        lessonId,
        value,
      },
    });
  },

  /**
   * Get average rating for a lesson
   */
  async getAverageRating(lessonId: string): Promise<number> {
    const result = await prisma.rating.aggregate({
      where: { lessonId },
      _avg: { value: true },
      _count: { value: true },
    });

    return result._avg.value || 0;
  },

  /**
   * Get rating count for a lesson
   */
  async getRatingCount(lessonId: string): Promise<number> {
    return prisma.rating.count({
      where: { lessonId },
    });
  },

  /**
   * Update lesson's average rating
   */
  async updateLessonAverageRating(lessonId: string): Promise<void> {
    const avgRating = await this.getAverageRating(lessonId);
    
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { rating: avgRating },
    });
  },
};

