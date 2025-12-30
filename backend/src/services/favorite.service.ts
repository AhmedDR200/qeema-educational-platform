/**
 * Favorite Service
 * Handles favorite-related business logic
 */

import { favoriteRepository, lessonRepository, studentRepository } from '../repositories';
import { ApiError } from '../utils/api-error';
import { FavoriteWithLesson } from '../repositories/favorite.repository';

export const favoriteService = {
  /**
   * Get all favorites for the current student
   */
  async getFavorites(userId: string): Promise<FavoriteWithLesson[]> {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound('Student profile');
    }

    return favoriteRepository.findByStudentId(student.id);
  },

  /**
   * Add lesson to favorites
   */
  async addFavorite(userId: string, lessonId: string): Promise<FavoriteWithLesson> {
    // Get student
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound('Student profile');
    }

    // Check if lesson exists
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson');
    }

    // Check if already favorited
    const existing = await favoriteRepository.findByStudentAndLesson(
      student.id,
      lessonId
    );
    if (existing) {
      throw ApiError.conflict('Lesson already in favorites');
    }

    return favoriteRepository.create(student.id, lessonId);
  },

  /**
   * Remove lesson from favorites
   */
  async removeFavorite(userId: string, lessonId: string): Promise<void> {
    // Get student
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound('Student profile');
    }

    // Check if favorite exists
    const existing = await favoriteRepository.findByStudentAndLesson(
      student.id,
      lessonId
    );
    if (!existing) {
      throw ApiError.notFound('Favorite');
    }

    await favoriteRepository.delete(student.id, lessonId);
  },

  /**
   * Check if lesson is favorited by user
   */
  async isFavorited(userId: string, lessonId: string): Promise<boolean> {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      return false;
    }

    return favoriteRepository.isFavorited(student.id, lessonId);
  },
};

