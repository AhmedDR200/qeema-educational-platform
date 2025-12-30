/**
 * Dashboard Service
 * Handles dashboard statistics business logic
 */

import { studentRepository, lessonRepository, favoriteRepository } from '../repositories';
import { prisma } from '../repositories/prisma';
import { DashboardStats } from '../types';

interface StudentGrowthData {
  date: string;
  count: number;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface TopFavoritedLesson {
  id: string;
  title: string;
  favoriteCount: number;
  rating: number;
}

interface RecentStudent {
  id: string;
  fullName: string;
  email: string;
  className: string | null;
  createdAt: Date;
}

export interface AnalyticsData {
  studentGrowth: StudentGrowthData[];
  ratingDistribution: RatingDistribution[];
  topFavoritedLessons: TopFavoritedLesson[];
  recentStudents: RecentStudent[];
  averageRating: number;
  totalRatings: number;
}

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

  /**
   * Get detailed analytics for the dashboard
   * Returns growth data, rating distribution, top lessons, and recent activity
   */
  async getAnalytics(): Promise<AnalyticsData> {
    // Get date from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Execute all queries in parallel
    const [
      studentsWithDates,
      lessonsWithFavorites,
      recentStudentsData,
      ratingStats,
      allRatings,
    ] = await Promise.all([
      // Get students created in the last 7 days
      prisma.student.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      // Get lessons with their favorite counts
      prisma.lesson.findMany({
        select: {
          id: true,
          title: true,
          rating: true,
          _count: {
            select: {
              favorites: true,
            },
          },
        },
        orderBy: {
          favorites: {
            _count: 'desc',
          },
        },
        take: 5,
      }),

      // Get recent students
      prisma.student.findMany({
        select: {
          id: true,
          fullName: true,
          className: true,
          createdAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),

      // Get rating statistics
      prisma.rating.aggregate({
        _avg: {
          value: true,
        },
        _count: true,
      }),

      // Get all lessons with ratings for distribution
      prisma.lesson.findMany({
        where: {
          rating: {
            gt: 0,
          },
        },
        select: {
          rating: true,
        },
      }),
    ]);

    // Process student growth data (group by day)
    const studentGrowthMap = new Map<string, number>();
    
    // Initialize all 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      studentGrowthMap.set(dateStr, 0);
    }

    // Count students per day
    studentsWithDates.forEach((student) => {
      const dateStr = student.createdAt.toISOString().split('T')[0];
      const currentCount = studentGrowthMap.get(dateStr) || 0;
      studentGrowthMap.set(dateStr, currentCount + 1);
    });

    const studentGrowth: StudentGrowthData[] = Array.from(studentGrowthMap.entries()).map(
      ([date, count]) => ({ date, count })
    );

    // Process rating distribution (1-5 stars)
    const ratingDistributionMap = new Map<number, number>();
    for (let i = 1; i <= 5; i++) {
      ratingDistributionMap.set(i, 0);
    }

    allRatings.forEach((lesson) => {
      const roundedRating = Math.round(lesson.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        const currentCount = ratingDistributionMap.get(roundedRating) || 0;
        ratingDistributionMap.set(roundedRating, currentCount + 1);
      }
    });

    const ratingDistribution: RatingDistribution[] = Array.from(
      ratingDistributionMap.entries()
    ).map(([rating, count]) => ({ rating, count }));

    // Process top favorited lessons
    const topFavoritedLessons: TopFavoritedLesson[] = lessonsWithFavorites.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      favoriteCount: lesson._count.favorites,
      rating: lesson.rating,
    }));

    // Process recent students
    const recentStudents: RecentStudent[] = recentStudentsData.map((student) => ({
      id: student.id,
      fullName: student.fullName,
      email: student.user.email,
      className: student.className,
      createdAt: student.createdAt,
    }));

    return {
      studentGrowth,
      ratingDistribution,
      topFavoritedLessons,
      recentStudents,
      averageRating: ratingStats._avg.value || 0,
      totalRatings: ratingStats._count,
    };
  },
};

