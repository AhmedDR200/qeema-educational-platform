/**
 * Student Service
 * Handles student-related business logic
 */

import bcrypt from 'bcrypt';
import { config } from '../config';
import { studentRepository, userRepository } from '../repositories';
import { ApiError } from '../utils/api-error';
import { CreateStudentDTO, UpdateStudentDTO, PaginationMeta } from '../types';
import { StudentWithUser } from '../repositories/student.repository';
import { Role } from '@prisma/client';

export const studentService = {
  /**
   * Get paginated list of students
   * For admin use only
   */
  async getStudents(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{
    students: StudentWithUser[];
    meta: PaginationMeta;
  }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const { students, total } = await studentRepository.findMany({
      search,
      skip,
      take: limit,
    });

    return {
      students,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get student by ID
   * Admin can access any student, students can only access their own
   */
  async getStudentById(
    id: string,
    requesterId: string,
    requesterRole: Role
  ): Promise<StudentWithUser> {
    const student = await studentRepository.findByIdWithUser(id);
    if (!student) {
      throw ApiError.notFound('Student');
    }

    // Students can only access their own profile
    if (requesterRole === Role.STUDENT && student.userId !== requesterId) {
      throw ApiError.forbidden('You can only access your own profile');
    }

    return student;
  },

  /**
   * Get student profile by user ID
   * Used for getting current user's student profile
   */
  async getStudentByUserId(userId: string): Promise<StudentWithUser> {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound('Student profile');
    }

    const studentWithUser = await studentRepository.findByIdWithUser(student.id);
    if (!studentWithUser) {
      throw ApiError.notFound('Student profile');
    }

    return studentWithUser;
  },

  /**
   * Create new student (admin only)
   * Creates both user account and student profile
   */
  async createStudent(data: CreateStudentDTO): Promise<StudentWithUser> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    // Create user with student profile
    const user = await userRepository.createWithStudent({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
    });

    // Update student with additional fields if provided
    if (data.className || data.academicYear || data.phoneNumber || data.profileImageUrl) {
      const updatedStudent = await studentRepository.update(user.student!.id, {
        className: data.className,
        academicYear: data.academicYear,
        phoneNumber: data.phoneNumber,
        profileImageUrl: data.profileImageUrl,
      });
      return updatedStudent;
    }

    const studentWithUser = await studentRepository.findByIdWithUser(user.student!.id);
    return studentWithUser!;
  },

  /**
   * Update student profile
   * Admin can update any student, students can only update their own
   */
  async updateStudent(
    id: string,
    data: UpdateStudentDTO,
    requesterId: string,
    requesterRole: Role
  ): Promise<StudentWithUser> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Student');
    }

    // Students can only update their own profile
    if (requesterRole === Role.STUDENT && student.userId !== requesterId) {
      throw ApiError.forbidden('You can only update your own profile');
    }

    return studentRepository.update(id, data);
  },

  /**
   * Delete student (admin only)
   * Deletes both student profile and associated user account
   */
  async deleteStudent(id: string): Promise<void> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Student');
    }

    // Delete user (cascades to student due to relation)
    await userRepository.delete(student.userId);
  },
};

