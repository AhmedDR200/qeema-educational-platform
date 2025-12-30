/**
 * Favorite Controller
 * Handles HTTP requests for favorite endpoints
 */

import { Response, NextFunction } from 'express';
import { favoriteService } from '../services';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/api-response';
import { AuthenticatedRequest } from '../types';

export const favoriteController = {
  /**
   * GET /api/favorites
   * Get all favorites for current student
   */
  async getFavorites(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const favorites = await favoriteService.getFavorites(req.user!.userId);
      sendSuccess(res, favorites);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/favorites/:lessonId
   * Add lesson to favorites
   */
  async addFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const favorite = await favoriteService.addFavorite(
        req.user!.userId,
        req.params.lessonId
      );
      sendCreated(res, favorite, 'Lesson added to favorites');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/favorites/:lessonId
   * Remove lesson from favorites
   */
  async removeFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await favoriteService.removeFavorite(req.user!.userId, req.params.lessonId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },
};

