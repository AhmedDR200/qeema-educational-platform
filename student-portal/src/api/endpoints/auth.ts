/**
 * Authentication API Endpoints
 */

import axios from '../axios';
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../../types';

export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Register new student account
   */
  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      credentials
    );
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await axios.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

