import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import { MemberTypeBodyValue, type Period } from '../../Salaries/types/enums.types';
import type { AbsenceHistoryDto, AddAbsenceHistoryDto } from '../types/absence.types';

/** راجع 02-API-Contract-Detailed.md § 11) Absence */
export const absenceService = {
  getByDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<AbsenceHistoryDto>>(`/branches/${branchId}/Absence/department/${departmentId}`, { params: { pageNumber, take } })
      .then((res) => res.data),

  checkAttendance: (branchId: string, memberId: string, date: string, memberType: string, period: Period) =>
    axiosInstance
      .get<boolean>(`/branches/${branchId}/Absence/check-attendance`, { params: { memberId, date, memberType, period } })
      .then((res) => res.data),

  processDepartmentAbsences: (branchId: string, departmentId: string, period: Period) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Absence/process-department-absences`, null, { params: { departmentId, period } })
      .then((res) => res.data),

  /** ⚠️ memberType JSON body property — نفس مشكلة Salaries/Treasury، لازم اسم العضو الكامل */
  add: (branchId: string, dto: AddAbsenceHistoryDto) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Absence`, {
        ...dto,
        memberType: MemberTypeBodyValue[dto.memberType],
      })
      .then((res) => res.data),

  remove: (branchId: string, absenceId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Absence/${absenceId}`).then((res) => res.data),

  removeAll: (branchId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Absence/all`).then((res) => res.data),
};