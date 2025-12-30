/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors for auth and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Extract error message from response
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred';

    // Create a new error with the extracted message
    const enhancedError = new Error(message);
    (enhancedError as Error & { originalError: AxiosError }).originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

