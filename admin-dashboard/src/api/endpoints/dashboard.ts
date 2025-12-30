/**
 * Dashboard API Endpoints
 */

import axios from '../axios';
import { ApiResponse, DashboardStats } from '../../types';

export interface StudentGrowthData {
  date: string;
  count: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface TopFavoritedLesson {
  id: string;
  title: string;
  favoriteCount: number;
  rating: number;
}

export interface RecentStudent {
  id: string;
  fullName: string;
  email: string;
  className: string | null;
  createdAt: string;
}

export interface AnalyticsData {
  studentGrowth: StudentGrowthData[];
  ratingDistribution: RatingDistribution[];
  topFavoritedLessons: TopFavoritedLesson[];
  recentStudents: RecentStudent[];
  averageRating: number;
  totalRatings: number;
}

export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await axios.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },

  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    const response = await axios.get<ApiResponse<AnalyticsData>>('/dashboard/analytics');
    return response.data;
  },
};

