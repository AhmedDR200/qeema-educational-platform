/**
 * Dashboard API Endpoints
 */

import axios from '../axios';
import { ApiResponse, DashboardStats } from '../../types';

export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await axios.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};

