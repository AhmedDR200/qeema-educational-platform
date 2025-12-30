/**
 * Dashboard Service
 * Handles dashboard statistics business logic
 */

import { studentRepository, lessonRepository, favoriteRepository } from '../repositories';
import { DashboardStats } from '../types';

export const dashboardService = {
  /**
   * Get dashboard statistics
   * Returns counts of students, lessons, and favorites
   */
  async getStats(): Promise<DashboardStats> {
    // Execute all count queries in parallel for better performance
    const [totalStudents, totalLessons, totalFavorites] = await Promise.all([
      studentRepository.count(),
      lessonRepository.count(),
      favoriteRepository.count(),
    ]);

    return {
      totalStudents,
      totalLessons,
      totalFavorites,
    };
  },
};

