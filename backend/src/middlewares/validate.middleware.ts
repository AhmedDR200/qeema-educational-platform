/**
 * Validation Middleware
 * Validates request data against Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validation target - which part of the request to validate
 */
type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates a validation middleware for the specified schema and target
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of request to validate (body, query, or params)
 * @returns Express middleware function
 *
 * @example
 * // Validate request body
 * router.post('/users', validate(createUserSchema, 'body'), createUser)
 *
 * // Validate query parameters
 * router.get('/users', validate(paginationSchema, 'query'), getUsers)
 *
 * // Validate URL parameters
 * router.get('/users/:id', validate(idSchema, 'params'), getUser)
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Parse and validate the target data
      const data = await schema.parseAsync(req[target]);

      // Replace original data with parsed (and potentially transformed) data
      // This ensures type coercion and defaults are applied
      req[target] = data;

      next();
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  };
}

/**
 * Validates multiple targets at once
 *
 * @example
 * router.put(
 *   '/users/:id',
 *   validateMultiple({
 *     params: idSchema,
 *     body: updateUserSchema
 *   }),
 *   updateUser
 * )
 */
export function validateMultiple(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate each specified target
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

