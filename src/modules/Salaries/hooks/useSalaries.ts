import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { salaryService } from '../services/salaryService';
import type { AddSalaryDto, UpdateSalaryDto } from '../types/salary.types';
import type { ApiError } from '@/types/api-error.types';
import type { MemberType } from '@/types/enums.types';

export const salaryKeys = {
  all: ['salaries'] as const,
  list: (branchId: string, type: MemberType) => [...salaryKeys.all, 'list', branchId, type] as const,
  listRange: (branchId: string, type: MemberType, dateFrom: string, dateTo: string) =>
    [...salaryKeys.all, 'list-range', branchId, type, { dateFrom, dateTo }] as const,
  receipt: (branchId: string, salaryId: string) => [...salaryKeys.all, 'receipt', branchId, salaryId] as const,
  receiptsRange: (branchId: string, dateFrom: string, dateTo: string, type?: MemberType) =>
    [...salaryKeys.all, 'receipts-range', branchId, { dateFrom, dateTo, type }] as const,
};

/** راجع 05-Caching...md نمط عام: قوائم مالية شهرية staleTime = 30 ثانية */
export function useSalariesList(branchId: string, type: MemberType) {
  return useQuery({
    queryKey: salaryKeys.list(branchId, type),
    queryFn: () => salaryService.getList(branchId, type),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

export function useSalariesListByDateRange(branchId: string, type: MemberType, dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: salaryKeys.listRange(branchId, type, dateFrom, dateTo),
    queryFn: () => salaryService.getListByDateRange(branchId, type, dateFrom, dateTo),
    enabled: !!branchId && !!dateFrom && !!dateTo,
    staleTime: 30_000,
  });
}

export function useSalaryReceipt(branchId: string, salaryId: string | null) {
  return useQuery({
    queryKey: salaryKeys.receipt(branchId, salaryId ?? ''),
    queryFn: () => salaryService.getReceipt(branchId, salaryId as string),
    enabled: !!branchId && !!salaryId,
    staleTime: 60_000,
  });
}

export function useCreateSalary(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddSalaryDto) => salaryService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salaryKeys.all });
      toast.success('تم تسجيل الراتب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateSalary(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSalaryDto) => salaryService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salaryKeys.all });
      toast.success('تم تعديل الراتب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useEmployeeBaseSalary(
  branchId: string,
  type: MemberType | undefined,
  employeeId: string | undefined
) {
  return useQuery({
    queryKey: [...salaryKeys.all, 'base-salary', branchId, type, employeeId],
    queryFn: () => salaryService.getBaseSalary(branchId, type as MemberType, employeeId as string),
    enabled: !!branchId && !!type && !!employeeId,
    staleTime: 0, // نحتاج قيمة فريش دايمًا وقت الاختيار
  });
}

export function useDeleteSalary(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (salaryId: string) => salaryService.remove(branchId, salaryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salaryKeys.all });
      toast.success('تم حذف الراتب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}