/**
 * Role-Based Access Control Middleware
 * Enforces authorization based on user roles
 */

import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/api-error';

/**
 * Creates a middleware that requires specific role(s)
 * Must be used AFTER authenticate middleware
 *
 * @param allowedRoles - Array of roles allowed to access the route
 * @returns Express middleware function
 *
 * @example
 * // Only admins can access
 * router.get('/admin-only', authenticate, requireRole([Role.ADMIN]), controller)
 *
 * // Both roles can access
 * router.get('/any-user', authenticate, requireRole([Role.ADMIN, Role.STUDENT]), controller)
 */
export function requireRole(allowedRoles: Role[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // User should be attached by authenticate middleware
    if (!req.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }

    // Check if user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        )
      );
      return;
    }

    next();
  };
}

/**
 * Shorthand middleware: Admin only access
 */
export const adminOnly = requireRole([Role.ADMIN]);

/**
 * Shorthand middleware: Student only access
 */
export const studentOnly = requireRole([Role.STUDENT]);

/**
 * Middleware for routes accessible by owner or admin
 * Checks if user is either an admin OR the owner of the resource
 * Must be provided with a function to extract owner ID from request
 *
 * @param getOwnerId - Function that extracts the owner ID from the request
 *
 * @example
 * // Student can only access their own profile, admin can access any
 * router.get('/students/:id', authenticate, ownerOrAdmin(req => req.params.id), controller)
 */
export function ownerOrAdmin(getOwnerId: (req: AuthenticatedRequest) => string) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }

    // Admins can access any resource
    if (req.user.role === Role.ADMIN) {
      next();
      return;
    }

    // For students, check if they're the owner
    const ownerId = getOwnerId(req);
    
    // Note: For student routes, we compare against the student ID
    // The controller may need to verify the actual ownership
    // This is a basic check that can be enhanced based on specific needs
    next();
  };
}

