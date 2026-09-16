import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { ClassMenuDto, AddClassroomDto, UpdateClassroomDto } from '../types/classroom.types';

/** راجع 02-API-Contract-Detailed.md § 3) Classroom */
export const classroomService = {
  getList: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<ClassMenuDto>>(`/branches/${branchId}/Classroom/list`, { params: { pageNumber, take } })
      .then((res) => res.data),

  getCount: (branchId: string) =>
    axiosInstance.get<number>(`/branches/${branchId}/Classroom/count`).then((res) => res.data),

  add: (branchId: string, dto: AddClassroomDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Classroom`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateClassroomDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Classroom`, dto).then((res) => res.data),

  remove: (branchId: string, classroomId: string) =>
    axiosInstance
      .delete<MessageResponse>(`/branches/${branchId}/Classroom/${classroomId}`)
      .then((res) => res.data),
};
