/**
 * School Service
 * Handles school profile business logic
 */

import { School } from '@prisma/client';
import { schoolRepository } from '../repositories';
import { ApiError } from '../utils/api-error';
import { UpdateSchoolDTO } from '../types';

export const schoolService = {
  /**
   * Get school profile
   */
  async getSchool(): Promise<School> {
    const school = await schoolRepository.get();
    if (!school) {
      throw ApiError.notFound('School profile');
    }
    return school;
  },

  /**
   * Update school profile
   */
  async updateSchool(data: UpdateSchoolDTO): Promise<School> {
    // Handle empty strings for optional URL fields
    const updateData: UpdateSchoolDTO = { ...data };
    if (data.logoUrl === '') {
      updateData.logoUrl = undefined;
    }
    if (data.phoneNumber === '') {
      updateData.phoneNumber = undefined;
    }

    return schoolRepository.update(updateData);
  },
};

