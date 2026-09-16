import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { treasuryService } from '../services/treasuryService';
import type { AddTreasuryDataDto, UpdateTreasuryDataDto } from '../types/treasury.types';
import type { ApiError } from '@/types/api-error.types';
import type { TrunsactionType } from '@/types/enums.types';

export const treasuryKeys = {
  all: ['treasury'] as const,
  monthly: (branchId: string, pageNumber: number, take: number, day?: string, departmentId?: string) =>
    [...treasuryKeys.all, 'monthly', branchId, { pageNumber, take, day, departmentId }] as const,
  monthlyOrder: (branchId: string, transaction: string, pageNumber: number, take: number, day?: string, departmentId?: string) =>
    [...treasuryKeys.all, 'monthly-order', branchId, { transaction, pageNumber, take, day, departmentId }] as const,
  yearly: (branchId: string, pageNumber: number, take: number, month?: string, day?: string, transaction?: string, departmentId?: string) =>
    [...treasuryKeys.all, 'yearly', branchId, { pageNumber, take, month, day, transaction, departmentId }] as const,
  yearlyByMonth: (branchId: string, month: string, pageNumber: number, take: number, transaction?: string, departmentId?: string) =>
    [...treasuryKeys.all, 'yearly-by-month', branchId, { month, pageNumber, take, transaction, departmentId }] as const,
  yearlyByType: (branchId: string, transaction: string, pageNumber: number, take: number, departmentId?: string) =>
    [...treasuryKeys.all, 'yearly-by-type', branchId, { transaction, pageNumber, take, departmentId }] as const,
  yearlyByTypeAndMonth: (branchId: string, transaction: string, month: string, day: string, pageNumber: number, take: number, departmentId?: string) =>
    [...treasuryKeys.all, 'yearly-by-type-month', branchId, { transaction, month, day, pageNumber, take, departmentId }] as const,
  months: (branchId: string, departmentId?: string) => [...treasuryKeys.all, 'months', branchId, departmentId] as const,
  monthlyReport: (branchId: string, year: number, month: number) =>
    [...treasuryKeys.all, 'monthly-report', branchId, year, month] as const,
  departmentsReport: (branchId: string, dateFrom?: string, dateTo?: string) =>
    [...treasuryKeys.all, 'departments-report', branchId, { dateFrom, dateTo }] as const,
  departmentTotal: (branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) =>
    [...treasuryKeys.all, 'department-total', branchId, departmentId, { dateFrom, dateTo }] as const,
  departmentByType: (branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) =>
    [...treasuryKeys.all, 'department-by-type', branchId, departmentId, { dateFrom, dateTo }] as const,
};

/** GET /Treasury/monthly — راجع 05-Caching-....md: Treasury staleTime = 30 ثانية */
export function useTreasuryMonthly(branchId: string, pageNumber: number, take: number, day?: string, departmentId?: string) {
  return useQuery({
    queryKey: treasuryKeys.monthly(branchId, pageNumber, take, day, departmentId),
    queryFn: () => treasuryService.getMonthly(branchId, pageNumber, take, day, departmentId),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

/** GET /Treasury/monthly/order — فلترة الحركات الشهرية حسب نوع الحركة (دخل/صرف) */
export function useTreasuryMonthlyOrder(
  branchId: string,
  transaction: TrunsactionType,
  pageNumber: number,
  take: number,
  day?: string,
  departmentId?: string
) {
  return useQuery({
    queryKey: treasuryKeys.monthlyOrder(branchId, String(transaction), pageNumber, take, day, departmentId),
    queryFn: () => treasuryService.getMonthlyOrder(branchId, transaction, pageNumber, take, day, departmentId),
    enabled: !!branchId && transaction !== undefined && transaction !== null,
    staleTime: 30_000,
  });
}

/** GET /Treasury/yearly — الحركات السنوية بفلاتر اختيارية (شهر/يوم/نوع/قسم) */
export function useTreasuryYearly(
  branchId: string,
  pageNumber: number,
  take: number,
  month?: string,
  day?: string,
  transaction?: TrunsactionType,
  departmentId?: string
) {
  return useQuery({
    queryKey: treasuryKeys.yearly(branchId, pageNumber, take, month, day, transaction !== undefined ? String(transaction) : undefined, departmentId),
    queryFn: () => treasuryService.getYearly(branchId, pageNumber, take, month, day, transaction, departmentId),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

/** GET /Treasury/yearly/month — الحركات السنوية لشهر محدد */
export function useTreasuryYearlyByMonth(
  branchId: string,
  month: string,
  pageNumber: number,
  take: number,
  transaction?: TrunsactionType,
  departmentId?: string
) {
  return useQuery({
    queryKey: treasuryKeys.yearlyByMonth(branchId, month, pageNumber, take, transaction !== undefined ? String(transaction) : undefined, departmentId),
    queryFn: () => treasuryService.getYearlyByMonth(branchId, month, pageNumber, take, transaction, departmentId),
    enabled: !!branchId && !!month,
    staleTime: 30_000,
  });
}

/** GET /Treasury/yearly/type — الحركات السنوية حسب نوع الحركة فقط */
export function useTreasuryYearlyByType(
  branchId: string,
  transaction: TrunsactionType,
  pageNumber: number,
  take: number,
  departmentId?: string
) {
  return useQuery({
    queryKey: treasuryKeys.yearlyByType(branchId, String(transaction), pageNumber, take, departmentId),
    queryFn: () => treasuryService.getYearlyByType(branchId, transaction, pageNumber, take, departmentId),
    enabled: !!branchId && transaction !== undefined && transaction !== null,
    staleTime: 30_000,
  });
}

/** GET /Treasury/yearly/type/month — الحركات السنوية حسب نوع الحركة + شهر + يوم محدد */
export function useTreasuryYearlyByTypeAndMonth(
  branchId: string,
  transaction: TrunsactionType,
  month: string,
  day: string,
  pageNumber: number,
  take: number,
  departmentId?: string
) {
  return useQuery({
    queryKey: treasuryKeys.yearlyByTypeAndMonth(branchId, String(transaction), month, day, pageNumber, take, departmentId),
    queryFn: () => treasuryService.getYearlyByTypeAndMonth(branchId, transaction, month, day, pageNumber, take, departmentId),
    enabled: !!branchId && !!month && !!day && transaction !== undefined && transaction !== null,
    staleTime: 30_000,
  });
}

/** GET /Treasury/months — الشهور المتاحة اللي فيها بيانات خزينة */
export function useAvailableMonths(branchId: string, departmentId?: string) {
  return useQuery({
    queryKey: treasuryKeys.months(branchId, departmentId),
    queryFn: () => treasuryService.getAvailableMonths(branchId, departmentId),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

/** تقرير الخزنة الشهري (دخل/رواتب/مصاريف/أرباح/رصيد/متأخرات) */
export function useMonthlyTreasuryReport(branchId: string, year: number, month: number) {
  return useQuery({
    queryKey: treasuryKeys.monthlyReport(branchId, year, month),
    queryFn: () => treasuryService.getMonthlyReport(branchId, year, month),
    enabled: !!branchId && !!year && !!month,
    staleTime: 30_000,
  });
}

/** تقرير الأقسام (نسبة التحصيل لكل قسم) */
export function useDepartmentsTreasuryReport(branchId: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: treasuryKeys.departmentsReport(branchId, dateFrom, dateTo),
    queryFn: () => treasuryService.getDepartmentsReport(branchId, dateFrom, dateTo),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

/** GET /Treasury/department/{id}/total — إجمالي الخزينة لقسم معين */
export function useDepartmentTreasuryTotal(branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: treasuryKeys.departmentTotal(branchId, departmentId, dateFrom, dateTo),
    queryFn: () => treasuryService.getDepartmentTotal(branchId, departmentId, dateFrom, dateTo),
    enabled: !!branchId && !!departmentId,
    staleTime: 30_000,
  });
}

/** GET /Treasury/department/{id}/by-type — إحصائيات القسم مجمعة حسب نوع الحركة */
export function useDepartmentTreasuryByType(branchId: string, departmentId: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: treasuryKeys.departmentByType(branchId, departmentId, dateFrom, dateTo),
    queryFn: () => treasuryService.getDepartmentByType(branchId, departmentId, dateFrom, dateTo),
    enabled: !!branchId && !!departmentId,
    staleTime: 30_000,
  });
}

export function useCreateTreasuryEntry(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddTreasuryDataDto) => treasuryService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treasuryKeys.all });
      toast.success('تم إضافة الحركة المالية بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/**
 * ⚠️ التعديل بيحتاج treasuryDataId، وهو مش موجود في TreasuryDataDto الحالي
 * (اللي بيرجع من /monthly أو /yearly). الـ Hook جاهز، لكن لازم الباك يضيف
 * حقل "id" في TreasuryDataDto عشان يبقى ينفع نستخدمه على صف معين في الجدول.
 */
export function useUpdateTreasuryEntry(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateTreasuryDataDto) => treasuryService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treasuryKeys.all });
      toast.success('تم تعديل الحركة المالية بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** ⚠️ نفس ملاحظة التعديل: محتاج treasuryDataId غير متاح حاليًا في الـ DTO */
export function useDeleteTreasuryEntry(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (treasuryDataId: string) => treasuryService.remove(branchId, treasuryDataId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treasuryKeys.all });
      toast.success('تم حذف الحركة المالية بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** تسجيل مقدمة/عربون طفل — Endpoint مخصص منفصل عن الطفل نفسه */
export function useMarkAdvancePayment(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ childId, amount }: { childId: string; amount: number }) =>
      treasuryService.markAdvancePayment(branchId, childId, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treasuryKeys.all });
      toast.success('تم تسجيل مقدمة الطفل في الخزينة بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}


export function useMarkSubscriptionOverdue(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, originalMonth }: { subscriptionId: string; originalMonth: string }) =>
      treasuryService.markSubscriptionOverdue(branchId, subscriptionId, originalMonth),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treasuryKeys.all });
      toast.success('تم تحديد الاشتراك كمتأخر بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}