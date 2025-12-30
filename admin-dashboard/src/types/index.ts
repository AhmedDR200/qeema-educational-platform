/**
 * TypeScript Type Definitions for Admin Dashboard
 */

// ==================== User Types ====================

export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  className: string | null;
  academicYear: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
  };
}

// ==================== Lesson Types ====================

export interface Lesson {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== School Types ====================

export interface School {
  id: string;
  name: string;
  logoUrl: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Dashboard Types ====================

export interface DashboardStats {
  totalStudents: number;
  totalLessons: number;
  totalFavorites: number;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Auth Types ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== Form Types ====================

export interface StudentFormData {
  email: string;
  password: string;
  fullName: string;
  className: string;
  academicYear: string;
  phoneNumber: string;
  profileImageUrl: string;
}

export interface LessonFormData {
  title: string;
  description: string;
  imageUrl: string;
}

export interface SchoolFormData {
  name: string;
  logoUrl: string;
  phoneNumber: string;
}

