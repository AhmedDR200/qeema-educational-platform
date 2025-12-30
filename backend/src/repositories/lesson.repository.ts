/**
 * Lesson Repository
 * Handles all database operations for Lesson model
 */

import { Lesson, Prisma } from '@prisma/client';
import prisma from './prisma';

export interface LessonFilters {
  search?: string;
  skip?: number;
  take?: number;
}

export interface LessonWithFavoriteStatus extends Lesson {
  isFavorited?: boolean;
  favoriteCount?: number;
}

export const lessonRepository = {
  /**
   * Find lesson by ID
   */
  async findById(id: string): Promise<Lesson | null> {
    return prisma.lesson.findUnique({
      where: { id },
    });
  },

  /**
   * Find lesson by ID with favorite status for a specific student
   */
  async findByIdWithFavoriteStatus(
    id: string,
    studentId?: string
  ): Promise<LessonWithFavoriteStatus | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        _count: {
          select: { favorites: true },
        },
        ...(studentId && {
          favorites: {
            where: { studentId },
            select: { id: true },
          },
        }),
      },
    });

    if (!lesson) return null;

    return {
      ...lesson,
      isFavorited: studentId ? (lesson as { favorites?: { id: string }[] }).favorites?.length > 0 : undefined,
      favoriteCount: lesson._count.favorites,
    };
  },

  /**
   * Get all lessons with pagination, search, and optional favorite status
   */
  async findMany(
    filters: LessonFilters,
    studentId?: string
  ): Promise<{
    lessons: LessonWithFavoriteStatus[];
    total: number;
  }> {
    const { search, skip = 0, take = 10 } = filters;

    // Build where clause for search
    const where: Prisma.LessonWhereInput = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    // Execute count and find in parallel
    const [total, lessons] = await Promise.all([
      prisma.lesson.count({ where }),
      prisma.lesson.findMany({
        where,
        include: {
          _count: {
            select: { favorites: true },
          },
          ...(studentId && {
            favorites: {
              where: { studentId },
              select: { id: true },
            },
          }),
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Transform to include favorite status
    const transformedLessons: LessonWithFavoriteStatus[] = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      imageUrl: lesson.imageUrl,
      rating: lesson.rating,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      isFavorited: studentId
        ? (lesson as { favorites?: { id: string }[] }).favorites?.length > 0
        : undefined,
      favoriteCount: lesson._count.favorites,
    }));

    return { lessons: transformedLessons, total };
  },

  /**
   * Create a new lesson
   */
  async create(data: {
    title: string;
    description: string;
    imageUrl?: string;
    rating?: number;
  }): Promise<Lesson> {
    return prisma.lesson.create({
      data,
    });
  },

  /**
   * Update a lesson
   */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      rating?: number;
    }
  ): Promise<Lesson> {
    return prisma.lesson.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a lesson
   */
  async delete(id: string): Promise<Lesson> {
    return prisma.lesson.delete({
      where: { id },
    });
  },

  /**
   * Count total lessons
   */
  async count(): Promise<number> {
    return prisma.lesson.count();
  },
};

