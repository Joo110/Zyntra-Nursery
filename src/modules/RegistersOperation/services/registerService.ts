import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { RegisterDto } from '../types/register.types';

/** راجع 02-API-Contract-Detailed.md § 17) RegistersOperation */
export const registerService = {
  getList: (pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<RegisterDto>>('/RegistersOperation/list', { params: { pageNumber, take } })
      .then((res) => res.data),

  removeAll: () =>
    axiosInstance.delete<MessageResponse>('/RegistersOperation/all').then((res) => res.data),
};
