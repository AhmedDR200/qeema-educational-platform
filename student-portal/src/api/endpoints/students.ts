/**
 * Students API Endpoints
 */

import axios from '../axios';
import { ApiResponse, Student, ProfileFormData } from '../../types';

export const studentsApi = {
  /**
   * Get current student's profile
   */
  async getMyProfile(): Promise<ApiResponse<Student>> {
    const response = await axios.get<ApiResponse<Student>>('/students/profile');
    return response.data;
  },

  /**
   * Update student profile
   */
  async updateProfile(
    studentId: string,
    data: Partial<ProfileFormData>
  ): Promise<ApiResponse<Student>> {
    const response = await axios.put<ApiResponse<Student>>(
      `/students/${studentId}`,
      data
    );
    return response.data;
  },
};

