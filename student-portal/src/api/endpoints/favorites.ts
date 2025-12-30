/**
 * Favorites API Endpoints
 */

import axios from '../axios';
import { ApiResponse, Favorite } from '../../types';

export const favoritesApi = {
  /**
   * Get all favorites for current student
   */
  async getFavorites(): Promise<ApiResponse<Favorite[]>> {
    const response = await axios.get<ApiResponse<Favorite[]>>('/favorites');
    return response.data;
  },

  /**
   * Add lesson to favorites
   */
  async addFavorite(lessonId: string): Promise<ApiResponse<Favorite>> {
    const response = await axios.post<ApiResponse<Favorite>>(
      `/favorites/${lessonId}`
    );
    return response.data;
  },

  /**
   * Remove lesson from favorites
   */
  async removeFavorite(lessonId: string): Promise<void> {
    await axios.delete(`/favorites/${lessonId}`);
  },
};

