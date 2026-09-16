import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { DepartueHistoryDto } from '../types/departure.types';

/** راجع 02-API-Contract-Detailed.md § 12) Departure */
export const departureService = {
  getByDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<DepartueHistoryDto>>(`/branches/${branchId}/Departure/department/${departmentId}`, { params: { pageNumber, take } })
      .then((res) => res.data),

  addForDepartmentChild: (branchId: string, departmentId: string, childId: string, dateTime: string) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Departure/department/${departmentId}/child/${childId}`, null, { params: { dateTime } })
      .then((res) => res.data),

  remove: (branchId: string, departureId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Departure/${departureId}`).then((res) => res.data),

  removeAll: (branchId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Departure/all`).then((res) => res.data),
};
