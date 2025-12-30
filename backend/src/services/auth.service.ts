/**
 * Authentication Service
 * Handles user authentication business logic
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { userRepository } from '../repositories';
import { ApiError } from '../utils/api-error';
import { RegisterDTO, LoginDTO, AuthResponse, JWTPayload } from '../types';

/**
 * Generates JWT token for authenticated user
 */
function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export const authService = {
  /**
   * Register a new student
   * Creates user account and associated student profile
   */
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    // Create user with student profile
    const user = await userRepository.createWithStudent({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student
          ? {
              id: user.student.id,
              fullName: user.student.fullName,
              profileImageUrl: user.student.profileImageUrl,
            }
          : undefined,
      },
    };
  },

  /**
   * Login user (student or admin)
   * Verifies credentials and returns JWT token
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const user = await userRepository.findByEmailWithStudent(data.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student
          ? {
              id: user.student.id,
              fullName: user.student.fullName,
              profileImageUrl: user.student.profileImageUrl,
            }
          : undefined,
      },
    };
  },

  /**
   * Get current user profile
   * Returns user data from token payload
   */
  async getCurrentUser(userId: string): Promise<AuthResponse['user']> {
    const user = await userRepository.findByIdWithStudent(userId);
    if (!user) {
      throw ApiError.notFound('User');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      student: user.student
        ? {
            id: user.student.id,
            fullName: user.student.fullName,
            profileImageUrl: user.student.profileImageUrl,
          }
        : undefined,
    };
  },
};

