/**
 * Authentication Routes
 * Public routes for registration and login
 */

import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate, validate } from '../middlewares';
import { registerSchema, loginSchema } from '../utils/validators';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new student account
 * Public route - no authentication required
 */
router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register
);

/**
 * POST /api/auth/login
 * Login user (student or admin)
 * Public route - no authentication required
 */
router.post(
  '/login',
  validate(loginSchema, 'body'),
  authController.login
);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Protected route - requires valid JWT
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

export default router;

