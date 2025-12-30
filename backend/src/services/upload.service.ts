/**
 * Upload Service
 * Handles file uploads to Cloudinary
 */

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const uploadService = {
  /**
   * Upload an image buffer to Cloudinary
   */
  async uploadImage(
    buffer: Buffer,
    folder: string = 'qeema'
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          } else {
            reject(new Error('Upload failed - no result returned'));
          }
        }
      );

      uploadStream.end(buffer);
    });
  },

  /**
   * Delete an image from Cloudinary by public ID
   */
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  },
};

