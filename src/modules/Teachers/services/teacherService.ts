import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { TeacherListDto, TeacherDetailsDto, AddTeacherDto, UpdateTeacherDto } from '../types/teacher.types';

export const teacherService = {
  getList: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<TeacherListDto>>(`/branches/${branchId}/Teacher/list`, { params: { pageNumber, take } })
      .then((res) => res.data),

  search: (branchId: string, pageNumber: number, take: number, name: string) =>
    axiosInstance
      .get<PagedResult<TeacherListDto>>(`/branches/${branchId}/Teacher/list/search`, { params: { pageNumber, take, name } })
      .then((res) => res.data),

  getById: (branchId: string, id: string) =>
    axiosInstance
      .get<TeacherDetailsDto>(`/branches/${branchId}/Teacher/${id}`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddTeacherDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Teacher`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateTeacherDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Teacher`, dto).then((res) => res.data),

  remove: (branchId: string, teacherId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Teacher/${teacherId}`).then((res) => res.data),
};