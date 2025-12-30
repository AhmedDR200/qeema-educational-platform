/**
 * Upload API Endpoints
 */

import axios from '../axios';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export const uploadApi = {
  /**
   * Upload an image file
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  },
};

