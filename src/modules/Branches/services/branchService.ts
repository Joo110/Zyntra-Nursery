import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { BranchListDto, BranchDropdownDto, AddBranchDto, UpdateBranchDto } from '../types/branch.types';

/**
 * راجع 02-API-Contract-Detailed.md § 1) Branch
 */
export const branchService = {
  getList: (pageNumber: number, take: number, searchName?: string) =>
    axiosInstance
      .get<PagedResult<BranchListDto>>('/Branch/list', { params: { pageNumber, take, searchName } })
      .then((res) => res.data),

  getDropdown: () =>
    axiosInstance.get<BranchDropdownDto[]>('/Branch/dropdown').then((res) => res.data),

  add: (dto: AddBranchDto) =>
    axiosInstance.post<MessageResponse>('/Branch', dto).then((res) => res.data),

  update: (dto: UpdateBranchDto) =>
    axiosInstance.put<MessageResponse>('/Branch', dto).then((res) => res.data),

  remove: (branchId: string) =>
    axiosInstance.delete<MessageResponse>(`/Branch/${branchId}`).then((res) => res.data),
};
