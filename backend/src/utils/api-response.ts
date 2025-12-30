/**
 * API Response Utilities
 * Provides consistent response formatting across all endpoints
 */

import { Response } from 'express';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedResponse,
  PaginationMeta,
} from '../types';

/**
 * Sends a successful response with data
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
}

/**
 * Sends a successful response for resource creation
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message?: string
): Response {
  return sendSuccess(res, data, message, 201);
}

/**
 * Sends a paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta
): Response {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(200).json(response);
}

/**
 * Sends an error response
 */
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code: string = 'ERROR',
  details?: unknown
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * Sends a no content response (204)
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Calculates pagination metadata
 */
export function calculatePaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Parses pagination query parameters with defaults
 */
export function parsePaginationQuery(
  query: { page?: string; limit?: string },
  defaultLimit: number = 10,
  maxLimit: number = 100
): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const requestedLimit = parseInt(query.limit || String(defaultLimit), 10);
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

