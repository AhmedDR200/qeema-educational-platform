/**
 * Favorite Repository
 * Handles all database operations for Favorite model (junction table)
 */

import { Favorite, Prisma } from '@prisma/client';
import prisma from './prisma';

export type FavoriteWithLesson = Prisma.FavoriteGetPayload<{
  include: { lesson: true };
}>;

export const favoriteRepository = {
  /**
   * Find favorite by student and lesson
   */
  async findByStudentAndLesson(
    studentId: string,
    lessonId: string
  ): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
    });
  },

  /**
   * Get all favorites for a student with lesson details
   */
  async findByStudentId(studentId: string): Promise<FavoriteWithLesson[]> {
    return prisma.favorite.findMany({
      where: { studentId },
      include: { lesson: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Add lesson to favorites
   */
  async create(studentId: string, lessonId: string): Promise<FavoriteWithLesson> {
    return prisma.favorite.create({
      data: {
        studentId,
        lessonId,
      },
      include: { lesson: true },
    });
  },

  /**
   * Remove lesson from favorites
   */
  async delete(studentId: string, lessonId: string): Promise<Favorite> {
    return prisma.favorite.delete({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
    });
  },

  /**
   * Check if lesson is favorited by student
   */
  async isFavorited(studentId: string, lessonId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
      select: { id: true },
    });
    return !!favorite;
  },

  /**
   * Count total favorites
   */
  async count(): Promise<number> {
    return prisma.favorite.count();
  },

  /**
   * Count favorites for a specific student
   */
  async countByStudent(studentId: string): Promise<number> {
    return prisma.favorite.count({
      where: { studentId },
    });
  },
};

