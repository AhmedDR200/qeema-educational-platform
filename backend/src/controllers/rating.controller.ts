/**
 * Rating Controller
 * Handles HTTP requests for lesson ratings
 */

import { Response, NextFunction } from 'express';
import { ratingService } from '../services/rating.service';
import { sendSuccess } from '../utils/api-response';
import { AuthenticatedRequest } from '../types';

export const ratingController = {
  /**
   * Rate a lesson
   * POST /api/lessons/:lessonId/rate
   */
  async rateLesson(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      const { value } = req.body;
      const userId = req.user!.userId;

      const result = await ratingService.rateLesson(userId, lessonId, value);

      sendSuccess(res, result, 'Rating submitted successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user's rating for a lesson
   * GET /api/lessons/:lessonId/my-rating
   */
  async getMyRating(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      const userId = req.user!.userId;

      const rating = await ratingService.getUserRating(userId, lessonId);

      sendSuccess(res, { rating });
    } catch (error) {
      next(error);
    }
  },
};

