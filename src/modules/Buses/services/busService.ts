import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { BusListDto, BusDropdownDto, AddBusDto, UpdateBusDto } from '../types/bus.types';

/** راجع BusController بالباك (Zyntra.School.API/Controllers/BusController.cs) */
export const busService = {
  getList: (branchId: string, pageNumber: number, take: number, searchName?: string) =>
    axiosInstance
      .get<PagedResult<BusListDto>>(`/branches/${branchId}/Bus/list`, { params: { pageNumber, take, searchName } })
      .then((res) => res.data),

  getDropdown: (branchId: string) =>
    axiosInstance
      .get<BusDropdownDto[]>(`/branches/${branchId}/Bus/dropdown`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddBusDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Bus`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateBusDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Bus`, dto).then((res) => res.data),

  remove: (branchId: string, busId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Bus/${busId}`).then((res) => res.data),
};
