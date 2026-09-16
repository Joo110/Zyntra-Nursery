import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { attendanceService } from '../services/attendanceService';
import type { ApiError } from '@/types/api-error.types';

export const attendanceKeys = {
  all: ['attendance'] as const,
  byDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    [...attendanceKeys.all, branchId, departmentId, { pageNumber, take }] as const,
};

/** راجع 05-Caching-....md: Attendance staleTime = 0 (Fresh دائمًا) */
export function useAttendanceByDepartment(branchId: string, departmentId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: attendanceKeys.byDepartment(branchId, departmentId, pageNumber, take),
    queryFn: () => attendanceService.getByDepartment(branchId, departmentId, pageNumber, take),
    enabled: !!branchId && !!departmentId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAddAttendance(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, childId, dateTime, lateMinutes }: { departmentId: string; childId: string; dateTime: string; lateMinutes?: number }) =>
      attendanceService.addForDepartmentChild(branchId, departmentId, childId, dateTime, lateMinutes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success('تم تسجيل الحضور بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAttendance(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendanceService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: attendanceKeys.all }); toast.success('تم حذف السجل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAllAttendance(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceService.removeAll(branchId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: attendanceKeys.all }); toast.success('تم حذف جميع سجلات الحضور'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
