/**
 * Lesson Routes
 * Routes for lesson management
 */

import { Router } from 'express';
import { lessonController } from '../controllers';
import { ratingController } from '../controllers/rating.controller';
import { authenticate, adminOnly, validate } from '../middlewares';
import {
  createLessonSchema,
  updateLessonSchema,
  searchQuerySchema,
  idParamSchema,
  rateLessonSchema,
} from '../utils/validators';

const router = Router();

// All lesson routes require authentication
router.use(authenticate);

/**
 * GET /api/lessons
 * Get paginated list of lessons with optional search
 * Accessible by all authenticated users
 * Includes favorite status for students
 */
router.get(
  '/',
  validate(searchQuerySchema, 'query'),
  lessonController.getLessons
);

/**
 * GET /api/lessons/:id
 * Get lesson by ID
 * Accessible by all authenticated users
 * Includes favorite status for students
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  lessonController.getLessonById
);

/**
 * POST /api/lessons
 * Create new lesson (admin only)
 */
router.post(
  '/',
  adminOnly,
  validate(createLessonSchema, 'body'),
  lessonController.createLesson
);

/**
 * PUT /api/lessons/:id
 * Update lesson (admin only)
 */
router.put(
  '/:id',
  adminOnly,
  validate(idParamSchema, 'params'),
  validate(updateLessonSchema, 'body'),
  lessonController.updateLesson
);

/**
 * DELETE /api/lessons/:id
 * Delete lesson (admin only)
 */
router.delete(
  '/:id',
  adminOnly,
  validate(idParamSchema, 'params'),
  lessonController.deleteLesson
);

/**
 * POST /api/lessons/:lessonId/rate
 * Rate a lesson (students only)
 */
router.post(
  '/:lessonId/rate',
  validate(rateLessonSchema, 'body'),
  ratingController.rateLesson
);

/**
 * GET /api/lessons/:lessonId/my-rating
 * Get current user's rating for a lesson
 */
router.get(
  '/:lessonId/my-rating',
  ratingController.getMyRating
);

export default router;

