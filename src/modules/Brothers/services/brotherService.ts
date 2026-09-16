import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { BrotherListDto, AddBrotherInfoDto, UpdateBrotherInfoDto } from '../types/brother.types';

/** راجع 02-API-Contract-Detailed.md § 6) Brother — بدون branchId بالمسار */
export const brotherService = {
  getByChild: (childId: string) =>
    axiosInstance.get<BrotherListDto[]>(`/Brother/child/${childId}`).then((res) => res.data),

  getChildList: (childId: string, pageNumber: number, take: number, searchName?: string) =>
    axiosInstance
      .get<PagedResult<BrotherListDto>>(`/Brother/child/${childId}/list`, { params: { pageNumber, take, searchName } })
      .then((res) => res.data),

  add: (dto: AddBrotherInfoDto) => axiosInstance.post<MessageResponse>('/Brother', dto).then((res) => res.data),

  update: (dto: UpdateBrotherInfoDto) => axiosInstance.put<MessageResponse>('/Brother', dto).then((res) => res.data),

  remove: (brotherId: string) =>
    axiosInstance.delete<MessageResponse>(`/Brother/${brotherId}`).then((res) => res.data),
};
