/**
 * Lesson Service
 * Handles lesson-related business logic
 */

import { Lesson } from '@prisma/client';
import { lessonRepository, studentRepository } from '../repositories';
import { ratingRepository } from '../repositories/rating.repository';
import { ApiError } from '../utils/api-error';
import { CreateLessonDTO, UpdateLessonDTO, PaginationMeta } from '../types';
import { LessonWithFavoriteStatus } from '../repositories/lesson.repository';

export interface LessonWithRating extends LessonWithFavoriteStatus {
  userRating?: number | null;
  totalRatings?: number;
}

export const lessonService = {
  /**
   * Get paginated list of lessons
   * Includes favorite status if studentId is provided
   */
  async getLessons(options: {
    page: number;
    limit: number;
    search?: string;
    userId?: string; // User ID to check favorite status
  }): Promise<{
    lessons: LessonWithFavoriteStatus[];
    meta: PaginationMeta;
  }> {
    const { page, limit, search, userId } = options;
    const skip = (page - 1) * limit;

    // Get student ID if user is a student
    let studentId: string | undefined;
    if (userId) {
      const student = await studentRepository.findByUserId(userId);
      studentId = student?.id;
    }

    const { lessons, total } = await lessonRepository.findMany(
      { search, skip, take: limit },
      studentId
    );

    return {
      lessons,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get lesson by ID
   * Includes favorite status and user's rating if userId is provided
   */
  async getLessonById(id: string, userId?: string): Promise<LessonWithRating> {
    // Get student ID if user is a student
    let studentId: string | undefined;
    if (userId) {
      const student = await studentRepository.findByUserId(userId);
      studentId = student?.id;
    }

    const lesson = await lessonRepository.findByIdWithFavoriteStatus(id, studentId);
    if (!lesson) {
      throw ApiError.notFound('Lesson');
    }

    // Get user's rating and total ratings count
    let userRating: number | null = null;
    if (studentId) {
      const rating = await ratingRepository.findByStudentAndLesson(studentId, id);
      userRating = rating?.value || null;
    }
    const totalRatings = await ratingRepository.getRatingCount(id);

    return {
      ...lesson,
      userRating,
      totalRatings,
    };
  },

  /**
   * Create new lesson (admin only)
   * Rating starts at 0 and is updated by student ratings
   */
  async createLesson(data: CreateLessonDTO): Promise<Lesson> {
    return lessonRepository.create({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
    });
  },

  /**
   * Update lesson (admin only)
   */
  async updateLesson(id: string, data: UpdateLessonDTO): Promise<Lesson> {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw ApiError.notFound('Lesson');
    }

    // Handle empty strings for optional URL fields
    const updateData: UpdateLessonDTO = { ...data };
    if (data.imageUrl === '') {
      updateData.imageUrl = undefined;
    }

    return lessonRepository.update(id, updateData);
  },

  /**
   * Delete lesson (admin only)
   */
  async deleteLesson(id: string): Promise<void> {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw ApiError.notFound('Lesson');
    }

    await lessonRepository.delete(id);
  },
};

