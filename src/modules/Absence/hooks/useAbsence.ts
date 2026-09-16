import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { absenceService } from '../services/absenceService';
import type { Period } from '@/types/enums.types';
import type { ApiError } from '@/types/api-error.types';

export const absenceKeys = {
  all: ['absence'] as const,
  byDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    [...absenceKeys.all, branchId, departmentId, { pageNumber, take }] as const,
};

export function useAbsenceByDepartment(branchId: string, departmentId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: absenceKeys.byDepartment(branchId, departmentId, pageNumber, take),
    queryFn: () => absenceService.getByDepartment(branchId, departmentId, pageNumber, take),
    enabled: !!branchId && !!departmentId,
    staleTime: 0,
  });
}

/** راجع 03-Business-Flow.md § Absence Flow — عملية Batch جماعية */
export function useProcessDepartmentAbsences(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, period }: { departmentId: string; period: Period }) =>
      absenceService.processDepartmentAbsences(branchId, departmentId, period),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: absenceKeys.all });
      toast.success('تم تسجيل غياب الطلاب الغائبين اليوم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAbsence(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => absenceService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: absenceKeys.all }); toast.success('تم حذف السجل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAllAbsence(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => absenceService.removeAll(branchId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: absenceKeys.all }); toast.success('تم حذف جميع سجلات الغياب'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
