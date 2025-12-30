/**
 * Authentication API Endpoints
 */

import axios from '../axios';
import { ApiResponse, AuthResponse, LoginCredentials, User } from '../../types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await axios.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

