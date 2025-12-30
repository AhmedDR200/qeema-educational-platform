/**
 * Global Error Handler Middleware
 * Catches all errors and formats them consistently
 * Distinguishes between operational errors and programming errors
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error';
import { sendError } from '../utils/api-response';
import { config } from '../config';

/**
 * Formats Zod validation errors into a readable format
 */
function formatZodError(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  }
  return formatted;
}

/**
 * Global error handler - must be registered last in Express middleware chain
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  // Log error for debugging (in production, use a proper logger)
  if (!config.isProduction) {
    console.error('Error:', err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return sendError(
      res,
      422,
      'Validation failed',
      'VALIDATION_ERROR',
      formatZodError(err)
    );
  }

  // Handle our custom API errors
  if (err instanceof ApiError) {
    return sendError(
      res,
      err.statusCode,
      err.message,
      err.code,
      err.details
    );
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as { code: string; meta?: { target?: string[] } };
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] || 'field';
      return sendError(res, 409, `${field} already exists`, 'CONFLICT');
    }
    
    // Record not found
    if (prismaError.code === 'P2025') {
      return sendError(res, 404, 'Resource not found', 'NOT_FOUND');
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token', 'UNAUTHORIZED');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired', 'TOKEN_EXPIRED');
  }

  // Handle syntax errors in JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    return sendError(res, 400, 'Invalid JSON body', 'BAD_REQUEST');
  }

  // Default: Internal server error
  // Don't expose internal error details in production
  const message = config.isProduction
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return sendError(res, 500, message, 'INTERNAL_ERROR');
}

/**
 * 404 Not Found handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): Response {
  return sendError(
    res,
    404,
    `Route ${req.method} ${req.path} not found`,
    'ROUTE_NOT_FOUND'
  );
}

