/**
 * Rating Service
 * Business logic for lesson ratings
 */

import { ratingRepository } from '../repositories/rating.repository';
import { lessonRepository } from '../repositories/lesson.repository';
import { studentRepository } from '../repositories/student.repository';
import { ApiError } from '../utils/api-error';

export interface RatingResult {
  ratingId: string;
  lessonId: string;
  userRating: number;
  averageRating: number;
  totalRatings: number;
}

export const ratingService = {
  /**
   * Rate a lesson (create or update rating)
   */
  async rateLesson(
    userId: string,
    lessonId: string,
    value: number
  ): Promise<RatingResult> {
    // Validate rating value
    if (value < 1 || value > 5 || !Number.isInteger(value)) {
      throw ApiError.badRequest('Rating must be an integer between 1 and 5');
    }

    // Get student by user ID
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound('Student profile not found');
    }

    // Check if lesson exists
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found');
    }

    // Create or update the rating
    const rating = await ratingRepository.upsert(student.id, lessonId, value);

    // Update the lesson's average rating
    await ratingRepository.updateLessonAverageRating(lessonId);

    // Get updated stats
    const averageRating = await ratingRepository.getAverageRating(lessonId);
    const totalRatings = await ratingRepository.getRatingCount(lessonId);

    return {
      ratingId: rating.id,
      lessonId,
      userRating: value,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    };
  },

  /**
   * Get user's rating for a lesson
   */
  async getUserRating(
    userId: string,
    lessonId: string
  ): Promise<number | null> {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      return null;
    }

    const rating = await ratingRepository.findByStudentAndLesson(
      student.id,
      lessonId
    );

    return rating?.value || null;
  },
};

