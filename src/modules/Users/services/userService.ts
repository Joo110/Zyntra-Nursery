import { axiosInstance } from '@/services/api/axiosInstance';
import type {
  LoggedInStaffDto,
  UserListDto,
  UserDetailDto,
  AddUserDto,
  UpdateUserDto,
  UserStatisticsDto,
} from '../types/user.types';
import type { MessageResponse } from '@/types/pagination.types';

/**
 * طبقة الـ Service مسؤولة فقط عن نداءات الـ API — بدون أي UI Logic (راجع Master Prompt § Services).
 * راجع 02-API-Contract-Detailed.md § 18) User لكل تفاصيل الـ Endpoints.
 */
export const userService = {
  /**
   * ⚠️ POST /api/User/login يستقبل userName/password كـ Query Params وليس Body
   * (راجع BACKEND_ISSUES.md — قرار Backend موجود لا يمكن تغييره من الفرونت).
   */
  login: (userName: string, password: string) =>
    axiosInstance
      .post<LoggedInStaffDto>('/User/login', null, { params: { userName, password } })
      .then((res) => res.data),

  getAll: () => axiosInstance.get<UserListDto[]>('/User').then((res) => res.data),

  getActive: () => axiosInstance.get<UserListDto[]>('/User/active').then((res) => res.data),

  getById: (userId: string) =>
    axiosInstance.get<UserDetailDto>(`/User/${userId}`).then((res) => res.data),

  add: (dto: AddUserDto) =>
    axiosInstance.post<MessageResponse>('/User', dto).then((res) => res.data),

  update: (dto: UpdateUserDto) =>
    axiosInstance.put<MessageResponse>('/User', dto).then((res) => res.data),

  remove: (userId: string) =>
    axiosInstance.delete<MessageResponse>(`/User/${userId}`).then((res) => res.data),

  activate: (userId: string) =>
    axiosInstance.post<MessageResponse>(`/User/${userId}/activate`).then((res) => res.data),

  deactivate: (userId: string) =>
    axiosInstance.post<MessageResponse>(`/User/${userId}/deactivate`).then((res) => res.data),

  getStatistics: () =>
    axiosInstance.get<UserStatisticsDto>('/User/statistics').then((res) => res.data),
};
