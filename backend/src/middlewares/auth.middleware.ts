/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { ApiError } from '../utils/api-error';

/**
 * Extracts Bearer token from Authorization header
 */
function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user payload to request
 * Use this middleware on routes that require authentication
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    // Verify token and extract payload
    const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Attach user info to request for use in controllers
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication middleware
 * Attempts to authenticate but allows request to proceed without token
 * Useful for routes that behave differently for authenticated vs anonymous users
 */
export function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (token) {
      const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }

    next();
  } catch {
    // Token invalid or expired - proceed without authentication
    next();
  }
}

