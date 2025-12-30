/**
 * Prisma Client Singleton
 * Ensures a single instance of PrismaClient is used throughout the application
 * Prevents connection pool exhaustion during development with hot reloading
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for prisma in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing client if available (development hot reload) or create new one
export const prisma = global.prisma || new PrismaClient();

// Save to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

