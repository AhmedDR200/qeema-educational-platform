/**
 * Lessons API Endpoints
 */

import axios from '../axios';
import { PaginatedResponse, Lesson, LessonWithRating } from '../../types';

export interface GetLessonsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RatingResponse {
  ratingId: string;
  lessonId: string;
  userRating: number;
  averageRating: number;
  totalRatings: number;
}

export const lessonsApi = {
  /**
   * Get paginated list of lessons with optional search
   */
  async getLessons(params: GetLessonsParams = {}): Promise<PaginatedResponse<Lesson>> {
    const response = await axios.get<PaginatedResponse<Lesson>>('/lessons', {
      params,
    });
    return response.data;
  },

  /**
   * Get lesson by ID
   */
  async getLessonById(id: string): Promise<{ success: boolean; data: LessonWithRating }> {
    const response = await axios.get<{ success: boolean; data: LessonWithRating }>(
      `/lessons/${id}`
    );
    return response.data;
  },

  /**
   * Rate a lesson
   */
  async rateLesson(lessonId: string, value: number): Promise<{ success: boolean; data: RatingResponse }> {
    const response = await axios.post<{ success: boolean; data: RatingResponse }>(
      `/lessons/${lessonId}/rate`,
      { value }
    );
    return response.data;
  },
};

