import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type {
  DepartmentListDto,
  DepartmentDropdownDto,
  DepartmentDetailDto,
  AddDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFinancialStatsDto,
} from '../types/department.types';

/** راجع 02-API-Contract-Detailed.md § 2) Department */
export const departmentService = {
  getList: (branchId: string, pageNumber: number, take: number, searchName?: string) =>
    axiosInstance
      .get<PagedResult<DepartmentListDto>>(`/branches/${branchId}/Department/list`, {
        params: { pageNumber, take, searchName },
      })
      .then((res) => res.data),

  getDropdown: (branchId: string) =>
    axiosInstance
      .get<DepartmentDropdownDto[]>(`/branches/${branchId}/Department/dropdown`)
      .then((res) => res.data),

  getById: (branchId: string, departmentId: string) =>
    axiosInstance
      .get<DepartmentDetailDto>(`/branches/${branchId}/Department/${departmentId}`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddDepartmentDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Department`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateDepartmentDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Department`, dto).then((res) => res.data),

  remove: (branchId: string, departmentId: string) =>
    axiosInstance
      .delete<MessageResponse>(`/branches/${branchId}/Department/${departmentId}`)
      .then((res) => res.data),

  getFinancialStats: (branchId: string, departmentId: string) =>
    axiosInstance
      .get<DepartmentFinancialStatsDto>(`/branches/${branchId}/Department/${departmentId}/financial-stats`)
      .then((res) => res.data),
};
