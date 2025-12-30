/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { sendSuccess, sendCreated } from '../utils/api-response';
import { AuthenticatedRequest, RegisterDTO, LoginDTO } from '../types';

export const authController = {
  /**
   * POST /api/auth/register
   * Register a new student account
   */
  async register(
    req: Request<object, object, RegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   * Login user (student or admin)
   */
  async login(
    req: Request<object, object, LoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   */
  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.getCurrentUser(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },
};

