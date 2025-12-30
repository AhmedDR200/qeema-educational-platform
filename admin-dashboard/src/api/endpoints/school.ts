/**
 * School API Endpoints
 */

import axios from '../axios';
import { ApiResponse, School, SchoolFormData } from '../../types';

export const schoolApi = {
  async getSchool(): Promise<ApiResponse<School>> {
    const response = await axios.get<ApiResponse<School>>('/school');
    return response.data;
  },

  async updateSchool(data: Partial<SchoolFormData>): Promise<ApiResponse<School>> {
    const response = await axios.put<ApiResponse<School>>('/school', data);
    return response.data;
  },
};

