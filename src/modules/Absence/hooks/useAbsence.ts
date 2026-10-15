import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { absenceService } from '../services/absenceService';
import { MemberType, type Period } from '@/types/enums.types';
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

export function useAddBulkAbsence(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childIds, date }: { childIds: string[]; date: string }) => {
      const results = await Promise.allSettled(
        childIds.map((memberId) =>
          absenceService.add(branchId, { memberId, date, month: date, memberType: MemberType.Child })
        )
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      return { total: childIds.length, succeeded: childIds.length - failed, failed };
    },
    onSuccess: ({ total, succeeded, failed }) => {
      qc.invalidateQueries({ queryKey: absenceKeys.all });
      if (failed === 0) toast.success(total === 1 ? 'تم تسجيل الغياب بنجاح' : `تم تسجيل غياب ${succeeded} طالب بنجاح`);
      else if (succeeded === 0) toast.error('فشل تسجيل الغياب');
      else toast.warning(`تم تسجيل ${succeeded} وفشل تسجيل ${failed}`);
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
