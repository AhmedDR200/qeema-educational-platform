/**
 * TypeScript Type Definitions
 * Centralized types for the application
 */

import { Role } from '@prisma/client';
import { Request } from 'express';

// ==================== Auth Types ====================

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// ==================== API Response Types ====================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==================== Query Types ====================

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
}

// ==================== DTO Types ====================

// Auth DTOs
export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
    student?: {
      id: string;
      fullName: string;
      profileImageUrl: string | null;
    };
  };
}

// Student DTOs
export interface CreateStudentDTO {
  email: string;
  password: string;
  fullName: string;
  className?: string;
  academicYear?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface UpdateStudentDTO {
  fullName?: string;
  className?: string;
  academicYear?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

// Lesson DTOs
export interface CreateLessonDTO {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface UpdateLessonDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
}

// School DTOs
export interface UpdateSchoolDTO {
  name?: string;
  logoUrl?: string;
  phoneNumber?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalLessons: number;
  totalFavorites: number;
}

