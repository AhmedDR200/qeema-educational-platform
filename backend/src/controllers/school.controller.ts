/**
 * School Controller
 * Handles HTTP requests for school profile endpoints
 */

import { Response, NextFunction } from 'express';
import { schoolService } from '../services';
import { sendSuccess } from '../utils/api-response';
import { AuthenticatedRequest, UpdateSchoolDTO } from '../types';

export const schoolController = {
  /**
   * GET /api/school
   * Get school profile
   */
  async getSchool(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const school = await schoolService.getSchool();
      sendSuccess(res, school);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/school
   * Update school profile (admin only)
   */
  async updateSchool(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const school = await schoolService.updateSchool(req.body as UpdateSchoolDTO);
      sendSuccess(res, school, 'School profile updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

