/**
 * Student Routes
 * Routes for student management
 */

import { Router } from 'express';
import { studentController } from '../controllers';
import { authenticate, adminOnly, validate } from '../middlewares';
import {
  createStudentSchema,
  updateStudentSchema,
  searchQuerySchema,
  idParamSchema,
} from '../utils/validators';

const router = Router();

// All student routes require authentication
router.use(authenticate);

/**
 * GET /api/students/profile
 * Get current student's own profile
 * Accessible by students only
 */
router.get('/profile', studentController.getMyProfile);

/**
 * GET /api/students
 * Get paginated list of students with optional search
 * Admin only
 */
router.get(
  '/',
  adminOnly,
  validate(searchQuerySchema, 'query'),
  studentController.getStudents
);

/**
 * GET /api/students/:id
 * Get student by ID
 * Admin can access any, students can access their own
 */
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  studentController.getStudentById
);

/**
 * POST /api/students
 * Create new student (admin only)
 */
router.post(
  '/',
  adminOnly,
  validate(createStudentSchema, 'body'),
  studentController.createStudent
);

/**
 * PUT /api/students/:id
 * Update student profile
 * Admin can update any, students can update their own
 */
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateStudentSchema, 'body'),
  studentController.updateStudent
);

/**
 * DELETE /api/students/:id
 * Delete student (admin only)
 */
router.delete(
  '/:id',
  adminOnly,
  validate(idParamSchema, 'params'),
  studentController.deleteStudent
);

export default router;

