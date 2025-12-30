/**
 * Validation Schemas using Zod
 * Provides strong type-safe validation for all API inputs
 */

import { z } from 'zod';

// ==================== Common Validators ====================

const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email too long');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const uuidSchema = z.string().uuid('Invalid ID format');

// ==================== Auth Validators ====================

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// ==================== Student Validators ====================

export const createStudentSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long'),
  className: z.string().max(50, 'Class name too long').optional(),
  academicYear: z.string().max(20, 'Academic year too long').optional(),
  phoneNumber: z
    .string()
    .max(20, 'Phone number too long')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
    .optional(),
  profileImageUrl: z.string().url('Invalid URL format').optional(),
});

export const updateStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .optional(),
  className: z.string().max(50, 'Class name too long').optional(),
  academicYear: z.string().max(20, 'Academic year too long').optional(),
  phoneNumber: z
    .string()
    .max(20, 'Phone number too long')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  profileImageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

// ==================== Lesson Validators ====================

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description too long'),
  imageUrl: z.string().optional(),
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title too long')
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description too long')
    .optional(),
  imageUrl: z.string().optional().or(z.literal('')),
});

export const rateLessonSchema = z.object({
  value: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});

// ==================== School Validators ====================

export const updateSchoolSchema = z.object({
  name: z
    .string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name too long')
    .optional(),
  logoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .max(20, 'Phone number too long')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

// ==================== Query Validators ====================

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
});

export const searchQuerySchema = paginationQuerySchema.extend({
  search: z.string().max(100, 'Search query too long').optional(),
});

export const idParamSchema = z.object({
  id: uuidSchema,
});

export const lessonIdParamSchema = z.object({
  lessonId: uuidSchema,
});

// ==================== Type Exports ====================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;

