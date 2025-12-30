/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard statistics
 */

import { Response, NextFunction } from 'express';
import { dashboardService } from '../services';
import { sendSuccess } from '../utils/api-response';
import { AuthenticatedRequest } from '../types';

export const dashboardController = {
  /**
   * GET /api/dashboard/stats
   * Get dashboard statistics (admin only)
   */
  async getStats(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await dashboardService.getStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/dashboard/analytics
   * Get detailed analytics for dashboard charts (admin only)
   */
  async getAnalytics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const analytics = await dashboardService.getAnalytics();
      sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  },
};

