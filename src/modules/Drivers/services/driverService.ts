import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type {
  DriverListDto,
  DriverDropdownDto,
  DriverDetailsDto,
  AddDriverDto,
  UpdateDriverDto,
} from '../types/driver.types';

export const driverService = {
  getList: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<DriverListDto>>(`/branches/${branchId}/Driver/list`, { params: { pageNumber, take } })
      .then((res) => res.data),

  getDropdown: (branchId: string) =>
    axiosInstance
      .get<DriverDropdownDto[]>(`/branches/${branchId}/Driver/dropdown`)
      .then((res) => res.data),

  getById: (branchId: string, driverId: string) =>
    axiosInstance
      .get<DriverDetailsDto>(`/branches/${branchId}/Driver/${driverId}`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddDriverDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Driver`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateDriverDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Driver`, dto).then((res) => res.data),

  remove: (branchId: string, driverId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Driver/${driverId}`).then((res) => res.data),
};