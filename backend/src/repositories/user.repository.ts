/**
 * User Repository
 * Handles all database operations for User model
 */

import { User, Role, Prisma } from '@prisma/client';
import prisma from './prisma';

export type UserWithStudent = Prisma.UserGetPayload<{
  include: { student: true };
}>;

export const userRepository = {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find user by ID with student profile
   */
  async findByIdWithStudent(id: string): Promise<UserWithStudent | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { student: true },
    });
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find user by email with student profile
   */
  async findByEmailWithStudent(email: string): Promise<UserWithStudent | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { student: true },
    });
  },

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    password: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || Role.STUDENT,
      },
    });
  },

  /**
   * Create user with student profile (for registration)
   */
  async createWithStudent(data: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<UserWithStudent> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: Role.STUDENT,
        student: {
          create: {
            fullName: data.fullName,
          },
        },
      },
      include: { student: true },
    });
  },

  /**
   * Update user password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  /**
   * Delete user (cascades to student profile)
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  },
};

