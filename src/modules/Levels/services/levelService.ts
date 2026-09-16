import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { LevelDto, AddLevelDto, UpdateLevelDto } from '../types/level.types';

/** راجع 02-API-Contract-Detailed.md § 4) Level */
export const levelService = {
  getList: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<LevelDto>>(`/branches/${branchId}/Level/list`, { params: { pageNumber, take } })
      .then((res) => res.data),

  add: (branchId: string, dto: AddLevelDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Level`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateLevelDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Level`, dto).then((res) => res.data),

  remove: (branchId: string, levelId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Level/${levelId}`).then((res) => res.data),
};
