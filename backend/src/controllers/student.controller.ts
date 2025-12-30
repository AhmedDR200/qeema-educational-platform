/**
 * Student Controller
 * Handles HTTP requests for student endpoints
 */

import { Response, NextFunction } from 'express';
import { studentService } from '../services';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  parsePaginationQuery,
} from '../utils/api-response';
import { config } from '../config';
import { AuthenticatedRequest, CreateStudentDTO, UpdateStudentDTO } from '../types';

export const studentController = {
  /**
   * GET /api/students
   * Get paginated list of students (admin only)
   */
  async getStudents(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit } = parsePaginationQuery(
        req.query as { page?: string; limit?: string },
        config.pagination.defaultLimit,
        config.pagination.maxLimit
      );
      const search = req.query.search as string | undefined;

      const result = await studentService.getStudents({ page, limit, search });
      sendPaginated(res, result.students, result.meta);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/students/:id
   * Get student by ID (admin or owner)
   */
  async getStudentById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.getStudentById(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, student);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/students/profile
   * Get current student's profile
   */
  async getMyProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.getStudentByUserId(req.user!.userId);
      sendSuccess(res, student);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/students
   * Create new student (admin only)
   */
  async createStudent(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.createStudent(req.body as CreateStudentDTO);
      sendCreated(res, student, 'Student created successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/students/:id
   * Update student profile (admin or owner)
   */
  async updateStudent(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.updateStudent(
        req.params.id,
        req.body as UpdateStudentDTO,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, student, 'Student updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/students/:id
   * Delete student (admin only)
   */
  async deleteStudent(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await studentService.deleteStudent(req.params.id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },
};

