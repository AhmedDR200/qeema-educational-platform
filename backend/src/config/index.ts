/**
 * Application Configuration
 * Centralizes all environment variables and configuration settings
 * Uses defensive programming - validates required variables on startup
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Retrieves an environment variable, throwing if required and missing
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  // Server
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production',

  // Database
  databaseUrl: getEnvVar('DATABASE_URL'),

  // JWT
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  },

  // CORS
  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173,http://localhost:5174').split(','),
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Bcrypt
  bcrypt: {
    saltRounds: 12,
  },

  // Cloudinary
  cloudinary: {
    cloudName: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnvVar('CLOUDINARY_API_KEY'),
    apiSecret: getEnvVar('CLOUDINARY_API_SECRET'),
  },
} as const;

// Export type for config object
export type Config = typeof config;

