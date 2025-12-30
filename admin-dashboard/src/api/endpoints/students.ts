/**
 * Students API Endpoints
 */

import axios from '../axios';
import { ApiResponse, PaginatedResponse, Student, StudentFormData } from '../../types';

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const studentsApi = {
  async getStudents(params: GetStudentsParams = {}): Promise<PaginatedResponse<Student>> {
    const response = await axios.get<PaginatedResponse<Student>>('/students', {
      params,
    });
    return response.data;
  },

  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    const response = await axios.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data;
  },

  async createStudent(data: StudentFormData): Promise<ApiResponse<Student>> {
    const response = await axios.post<ApiResponse<Student>>('/students', data);
    return response.data;
  },

  async updateStudent(
    id: string,
    data: Partial<Omit<StudentFormData, 'email' | 'password'>>
  ): Promise<ApiResponse<Student>> {
    const response = await axios.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await axios.delete(`/students/${id}`);
  },
};

