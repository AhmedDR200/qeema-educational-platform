/**
 * Lesson Controller
 * Handles HTTP requests for lesson endpoints
 */

import { Response, NextFunction } from 'express';
import { lessonService } from '../services';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  parsePaginationQuery,
} from '../utils/api-response';
import { config } from '../config';
import { AuthenticatedRequest, CreateLessonDTO, UpdateLessonDTO } from '../types';

export const lessonController = {
  /**
   * GET /api/lessons
   * Get paginated list of lessons
   * Includes favorite status for authenticated students
   */
  async getLessons(
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

      const result = await lessonService.getLessons({
        page,
        limit,
        search,
        userId: req.user?.userId,
      });
      sendPaginated(res, result.lessons, result.meta);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/lessons/:id
   * Get lesson by ID
   * Includes favorite status for authenticated students
   */
  async getLessonById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lesson = await lessonService.getLessonById(
        req.params.id,
        req.user?.userId
      );
      sendSuccess(res, lesson);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/lessons
   * Create new lesson (admin only)
   */
  async createLesson(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lesson = await lessonService.createLesson(req.body as CreateLessonDTO);
      sendCreated(res, lesson, 'Lesson created successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/lessons/:id
   * Update lesson (admin only)
   */
  async updateLesson(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lesson = await lessonService.updateLesson(
        req.params.id,
        req.body as UpdateLessonDTO
      );
      sendSuccess(res, lesson, 'Lesson updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/lessons/:id
   * Delete lesson (admin only)
   */
  async deleteLesson(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await lessonService.deleteLesson(req.params.id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },
};

