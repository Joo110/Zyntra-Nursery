import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { Period } from '@/types/enums.types';
import type {
  ChildListDto,
  ChildDetailsDto,
  ChildBirthDateNotificationDto,
  ChildBasicInfoDto,
  AddChildDto,
  UpdateChildDto,
} from '../types/child.types';

/** راجع 02-API-Contract-Detailed.md § 5) Child */
export const childService = {
  getList: (
    branchId: string,
    departmentId: string,
    period: Period,
    pageNumber: number,
    take: number,
    name?: string
  ) =>
    axiosInstance
      .get<PagedResult<ChildListDto>>(`/branches/${branchId}/Child/list`, {
        params: { departmentId, period, pageNumber, take, name },
      })
      .then((res) => res.data),

  getById: (branchId: string, id: string) =>
    axiosInstance
      .get<ChildDetailsDto>(`/branches/${branchId}/Child/${id}`)
      .then((res) => res.data),

  getArchive: (
    branchId: string,
    departmentId: string,
    period: Period,
    pageNumber: number,
    take: number,
    name?: string
  ) =>
    axiosInstance
      .get<PagedResult<ChildListDto>>(`/branches/${branchId}/Child/archive`, {
        params: { departmentId, period, pageNumber, take, name },
      })
      .then((res) => res.data),

  getBirthdays: (branchId: string, departmentId: string, period: Period, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<ChildBirthDateNotificationDto>>(`/branches/${branchId}/Child/birthdays`, {
        params: { departmentId, period, pageNumber, take },
      })
      .then((res) => res.data),

  setActive: (branchId: string, id: string, isActive: boolean) =>
    axiosInstance
      .put<MessageResponse>(`/branches/${branchId}/Child/active/${id}`, null, { params: { isActive } })
      .then((res) => res.data),

  getNumberOfChildren: (branchId: string, period: Period) =>
    axiosInstance
      .get<number>(`/branches/${branchId}/Child/number-of-children`, { params: { period } })
      .then((res) => res.data),

  getDepartmentChildren: (branchId: string, departmentId: string, period: Period) =>
    axiosInstance
      .get<ChildBasicInfoDto[]>(`/branches/${branchId}/Child/department/${departmentId}/children`, {
        params: { period },
      })
      .then((res) => res.data),

  add: (branchId: string, dto: AddChildDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Child`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateChildDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Child`, dto).then((res) => res.data),

  remove: (branchId: string, childId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Child/${childId}`).then((res) => res.data),
};