/**
 * Upload Routes
 * Routes for file uploads
 */

import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/upload.controller';
import { authenticate } from '../middlewares';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// All upload routes require authentication
router.use(authenticate);

/**
 * POST /api/upload
 * Upload a single image
 */
router.post('/', upload.single('image'), uploadController.uploadImage);

export default router;

