/**
 * School Repository
 * Handles all database operations for School model (singleton)
 */

import { School } from '@prisma/client';
import prisma from './prisma';

export const schoolRepository = {
  /**
   * Get school profile (singleton - always returns the first/only record)
   */
  async get(): Promise<School | null> {
    return prisma.school.findFirst();
  },

  /**
   * Create school profile (should only be called once during seeding)
   */
  async create(data: {
    name: string;
    logoUrl?: string;
    phoneNumber?: string;
  }): Promise<School> {
    return prisma.school.create({
      data,
    });
  },

  /**
   * Update school profile
   * Uses upsert to handle the case where school doesn't exist yet
   */
  async update(data: {
    name?: string;
    logoUrl?: string;
    phoneNumber?: string;
  }): Promise<School> {
    // Get existing school or create default
    const existing = await prisma.school.findFirst();

    if (existing) {
      return prisma.school.update({
        where: { id: existing.id },
        data,
      });
    }

    // Create new school if none exists
    return prisma.school.create({
      data: {
        name: data.name || 'My School',
        logoUrl: data.logoUrl,
        phoneNumber: data.phoneNumber,
      },
    });
  },
};

