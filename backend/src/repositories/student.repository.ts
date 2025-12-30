/**
 * Student Repository
 * Handles all database operations for Student model
 */

import { Student, Prisma } from '@prisma/client';
import prisma from './prisma';

export type StudentWithUser = Prisma.StudentGetPayload<{
  include: { user: { select: { email: true } } };
}>;

export type StudentWithFavorites = Prisma.StudentGetPayload<{
  include: {
    user: { select: { email: true } };
    favorites: { include: { lesson: true } };
  };
}>;

export interface StudentFilters {
  search?: string;
  skip?: number;
  take?: number;
}

export const studentRepository = {
  /**
   * Find student by ID
   */
  async findById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id },
    });
  },

  /**
   * Find student by ID with user email
   */
  async findByIdWithUser(id: string): Promise<StudentWithUser | null> {
    return prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
      },
    });
  },

  /**
   * Find student by user ID
   */
  async findByUserId(userId: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { userId },
    });
  },

  /**
   * Find student by user ID with favorites
   */
  async findByUserIdWithFavorites(userId: string): Promise<StudentWithFavorites | null> {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true } },
        favorites: {
          include: { lesson: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  /**
   * Get all students with pagination and search
   */
  async findMany(filters: StudentFilters): Promise<{
    students: StudentWithUser[];
    total: number;
  }> {
    const { search, skip = 0, take = 10 } = filters;

    // Build where clause for search
    const where: Prisma.StudentWhereInput = search
      ? {
          OR: [
            { fullName: { contains: search } },
            { user: { email: { contains: search } } },
          ],
        }
      : {};

    // Execute count and find in parallel
    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        include: {
          user: { select: { email: true } },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { students, total };
  },

  /**
   * Create student profile (used by admin)
   */
  async create(data: {
    userId: string;
    fullName: string;
    className?: string;
    academicYear?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  }): Promise<Student> {
    return prisma.student.create({
      data,
    });
  },

  /**
   * Update student profile
   */
  async update(
    id: string,
    data: {
      fullName?: string;
      className?: string;
      academicYear?: string;
      phoneNumber?: string;
      profileImageUrl?: string;
    }
  ): Promise<StudentWithUser> {
    return prisma.student.update({
      where: { id },
      data,
      include: {
        user: { select: { email: true } },
      },
    });
  },

  /**
   * Delete student (user will cascade delete)
   */
  async delete(id: string): Promise<Student> {
    return prisma.student.delete({
      where: { id },
    });
  },

  /**
   * Count total students
   */
  async count(): Promise<number> {
    return prisma.student.count();
  },
};

