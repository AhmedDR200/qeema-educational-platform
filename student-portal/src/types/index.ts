/**
 * TypeScript Type Definitions for Student Portal
 */

// ==================== User Types ====================

export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  student?: {
    id: string;
    fullName: string;
    profileImageUrl: string | null;
  };
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
  isFavorited?: boolean;
  favoriteCount?: number;
}

export interface LessonWithRating extends Lesson {
  userRating?: number | null;
  totalRatings?: number;
}

// ==================== Favorite Types ====================

export interface Favorite {
  id: string;
  studentId: string;
  lessonId: string;
  createdAt: string;
  lesson: Lesson;
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

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== Form Types ====================

export interface ProfileFormData {
  fullName: string;
  className: string;
  academicYear: string;
  phoneNumber: string;
  profileImageUrl: string;
}

