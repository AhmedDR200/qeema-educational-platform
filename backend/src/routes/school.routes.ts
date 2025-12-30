/**
 * School Routes
 * Routes for school profile management
 */

import { Router } from 'express';
import { schoolController } from '../controllers';
import { authenticate, adminOnly, validate } from '../middlewares';
import { updateSchoolSchema } from '../utils/validators';

const router = Router();

// All school routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

/**
 * GET /api/school
 * Get school profile
 */
router.get('/', schoolController.getSchool);

/**
 * PUT /api/school
 * Update school profile
 */
router.put(
  '/',
  validate(updateSchoolSchema, 'body'),
  schoolController.updateSchool
);

export default router;

