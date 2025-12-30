/**
 * Upload Controller
 * Handles HTTP requests for file uploads
 */

import { Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { sendSuccess } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { AuthenticatedRequest } from '../types';

export const uploadController = {
  /**
   * Upload an image
   * POST /api/upload
   */
  async uploadImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No file uploaded');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw ApiError.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (req.file.size > maxSize) {
        throw ApiError.badRequest('File too large. Maximum size is 5MB');
      }

      // Upload to Cloudinary
      const result = await uploadService.uploadImage(req.file.buffer);

      sendSuccess(res, { url: result.url }, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  },
};

