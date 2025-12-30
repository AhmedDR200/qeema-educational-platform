/**
 * Favorite Routes
 * Routes for managing student favorites
 */

import { Router } from 'express';
import { favoriteController } from '../controllers';
import { authenticate, studentOnly, validate } from '../middlewares';
import { lessonIdParamSchema } from '../utils/validators';

const router = Router();

// All favorite routes require authentication and student role
router.use(authenticate);
router.use(studentOnly);

/**
 * GET /api/favorites
 * Get all favorites for current student
 */
router.get('/', favoriteController.getFavorites);

/**
 * POST /api/favorites/:lessonId
 * Add lesson to favorites
 */
router.post(
  '/:lessonId',
  validate(lessonIdParamSchema, 'params'),
  favoriteController.addFavorite
);

/**
 * DELETE /api/favorites/:lessonId
 * Remove lesson from favorites
 */
router.delete(
  '/:lessonId',
  validate(lessonIdParamSchema, 'params'),
  favoriteController.removeFavorite
);

export default router;

