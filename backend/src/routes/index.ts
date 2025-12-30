/**
 * Route Aggregator
 * Combines all route modules and mounts them on the Express app
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import lessonRoutes from './lesson.routes';
import favoriteRoutes from './favorite.routes';
import schoolRoutes from './school.routes';
import dashboardRoutes from './dashboard.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Mount all routes under /api prefix
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/school', schoolRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;

