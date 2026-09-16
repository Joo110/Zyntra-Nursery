import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import { MemberTypeBodyValue, type TrunsactionType } from '../../Salaries/types/enums.types';
import type {
  TreasuryDataDto,
  AddTreasuryDataDto,
  UpdateTreasuryDataDto,
  MonthlyTreasuryReportDto,
  DepartmentTreasuryReportDto,
} from '../types/treasury.types';

/** راجع TreasuryController الكامل بالباك (Zyntra.School.API/Controllers/TreasuryController.cs) */
export const treasuryService = {
  getMonthly: (branchId: string, pageNumber: number, take: number, day?: string, departmentId?: string) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/monthly`, { params: { pageNumber, take, day, departmentId } })
      .then((res) => res.data),

  getMonthlyOrder: (
    branchId: string,
    transaction: TrunsactionType,
    pageNumber: number,
    take: number,
    day?: string,
    departmentId?: string
  ) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/monthly/order`, {
        params: { transaction, pageNumber, take, day, departmentId },
      })
      .then((res) => res.data),

  getYearly: (
    branchId: string,
    pageNumber: number,
    take: number,
    month?: string,
    day?: string,
    transaction?: TrunsactionType,
    departmentId?: string
  ) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/yearly`, {
        params: { pageNumber, take, month, day, transaction, departmentId },
      })
      .then((res) => res.data),

  getYearlyByMonth: (
    branchId: string,
    month: string,
    pageNumber: number,
    take: number,
    transaction?: TrunsactionType,
    departmentId?: string
  ) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/yearly/month`, {
        params: { month, pageNumber, take, transaction, departmentId },
      })
      .then((res) => res.data),

  getYearlyByType: (
    branchId: string,
    transaction: TrunsactionType,
    pageNumber: number,
    take: number,
    departmentId?: string
  ) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/yearly/type`, {
        params: { transaction, pageNumber, take, departmentId },
      })
      .then((res) => res.data),

  getYearlyByTypeAndMonth: (
    branchId: string,
    transaction: TrunsactionType,
    month: string,
    day: string,
    pageNumber: number,
    take: number,
    departmentId?: string
  ) =>
    axiosInstance
      .get<PagedResult<TreasuryDataDto>>(`/branches/${branchId}/Treasury/yearly/type/month`, {
        params: { transaction, month, day, pageNumber, take, departmentId },
      })
      .then((res) => res.data),

  getAvailableMonths: (branchId: string, departmentId?: string) =>
    axiosInstance
      .get<string[]>(`/branches/${branchId}/Treasury/months`, { params: { departmentId } })
      .then((res) => res.data),

  /** ⚠️ memberType هنا JSON body property — نفس مشكلة Salaries: لازم يتبعت كاسم العضو
   *  الكامل ("Teacher"/"Worker"/"Child") مش كحرف، عشان الباك اند يقدر يعمل JSON deserialize
   *  للـ enum MemberType بنجاح. راجع MemberTypeQueryName في enums.types.ts. */
  add: (branchId: string, dto: AddTreasuryDataDto) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Treasury`, {
        ...dto,
        memberType: MemberTypeBodyValue[dto.memberType],
      })
      .then((res) => res.data),

  update: (branchId: string, dto: UpdateTreasuryDataDto) =>
    axiosInstance
      .put<MessageResponse>(`/branches/${branchId}/Treasury`, {
        ...dto,
        memberType: dto.memberType ? MemberTypeBodyValue[dto.memberType] : dto.memberType,
      })
      .then((res) => res.data),

  remove: (branchId: string, treasuryDataId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Treasury/${treasuryDataId}`).then((res) => res.data),

  getDepartmentTotal: (branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) =>
    axiosInstance
      .get<number>(`/branches/${branchId}/Treasury/department/${departmentId}/total`, { params: { dateFrom, dateTo } })
      .then((res) => res.data),

  getDepartmentByType: (branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) =>
    axiosInstance
      .get<Record<string, number>>(`/branches/${branchId}/Treasury/department/${departmentId}/by-type`, {
        params: { dateFrom, dateTo },
      })
      .then((res) => res.data),

  getDepartmentsReport: (branchId: string, dateFrom?: string, dateTo?: string) =>
    axiosInstance
      .get<DepartmentTreasuryReportDto[]>(`/branches/${branchId}/Treasury/departments/report`, {
        params: { dateFrom, dateTo },
      })
      .then((res) => res.data),

  getMonthlyReport: (branchId: string, year: number, month: number) =>
    axiosInstance
      .get<MonthlyTreasuryReportDto>(`/branches/${branchId}/Treasury/report/monthly`, { params: { year, month } })
      .then((res) => res.data),

  markSubscriptionOverdue: (branchId: string, subscriptionId: string, originalMonth: string) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Treasury/subscription/${subscriptionId}/mark-overdue`, null, {
        params: { originalMonth },
      })
      .then((res) => res.data),

  markAdvancePayment: (branchId: string, childId: string, amount: number) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Treasury/child/${childId}/advance-payment`, null, { params: { amount } })
      .then((res) => res.data),
};