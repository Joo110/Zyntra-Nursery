import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import { MemberTypeQueryName, type MemberType } from '../../Salaries/types/enums.types';
import type { AttendanceHistoryDto } from '../types/attendance.types';

/** راجع 02-API-Contract-Detailed.md § 10) Attendance */
export const attendanceService = {
  getByDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<AttendanceHistoryDto>>(`/branches/${branchId}/Attendance/department/${departmentId}`, {
        params: { pageNumber, take },
      })
      .then((res) => res.data),

  /** ⚠️ memberType لازم يتبعت كاسم العضو الكامل (Teacher/Worker/Child) مش الحرف — راجع MemberTypeQueryName */
  getHistory: (branchId: string, memberType: MemberType, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<AttendanceHistoryDto>>(`/branches/${branchId}/Attendance/history`, {
        params: { memberType: MemberTypeQueryName[memberType], pageNumber, take },
      })
      .then((res) => res.data),

  addForDepartmentChild: (branchId: string, departmentId: string, childId: string, dateTime: string, lateMinutes = 0) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Attendance/department/${departmentId}/child/${childId}`, null, {
        params: { dateTime, lateMinutes },
      })
      .then((res) => res.data),

  remove: (branchId: string, attendanceId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Attendance/${attendanceId}`).then((res) => res.data),

  removeAll: (branchId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Attendance/all`).then((res) => res.data),
};