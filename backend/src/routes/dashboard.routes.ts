/**
 * Dashboard Routes
 * Routes for admin dashboard statistics
 */

import { Router } from 'express';
import { dashboardController } from '../controllers';
import { authenticate, adminOnly } from '../middlewares';

const router = Router();

// All dashboard routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', dashboardController.getStats);

export default router;

