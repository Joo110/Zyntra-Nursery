import { axiosInstance } from '@/services/api/axiosInstance';
import type { MessageResponse } from '@/types/pagination.types';
import type { GraduationDto, AddGraduationDto, UpdateGraduationDto } from '../types/graduation.types';

/** راجع 02-API-Contract-Detailed.md § 7) Graduation — بدون Pagination (قائمة كاملة دائمًا) */
export const graduationService = {
  getAll: (branchId: string) =>
    axiosInstance.get<GraduationDto[]>(`/branches/${branchId}/Graduation`).then((res) => res.data),

  add: (branchId: string, dto: AddGraduationDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Graduation`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateGraduationDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Graduation`, dto).then((res) => res.data),

  remove: (branchId: string, graduationId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Graduation/${graduationId}`).then((res) => res.data),
};
