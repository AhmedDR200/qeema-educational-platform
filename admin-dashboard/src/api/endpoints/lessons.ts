/**
 * Lessons API Endpoints
 */

import { ApiResponse, Lesson, LessonFormData, PaginatedResponse } from '../../types';
import axios from '../axios';

export interface GetLessonsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const lessonsApi = {
    async getLessons(params: GetLessonsParams = {}): Promise<PaginatedResponse<Lesson>> {
        const response = await axios.get<PaginatedResponse<Lesson>>('/lessons', {
            params,
        });
        return response.data;
    },

    async getLessonById(id: string): Promise<ApiResponse<Lesson>> {
        const response = await axios.get<ApiResponse<Lesson>>(`/lessons/${id}`);
        return response.data;
    },

    async createLesson(data: LessonFormData): Promise<ApiResponse<Lesson>> {
        const response = await axios.post<ApiResponse<Lesson>>('/lessons', data);
        return response.data;
    },

    async updateLesson(id: string, data: Partial<LessonFormData>): Promise<ApiResponse<Lesson>> {
        const response = await axios.put<ApiResponse<Lesson>>(`/lessons/${id}`, data);
        return response.data;
    },

    async deleteLesson(id: string): Promise<void> {
        await axios.delete(`/lessons/${id}`);
    },
};

