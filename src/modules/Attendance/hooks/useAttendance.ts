import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { attendanceService } from '../services/attendanceService';
import type { AddAttendanceHistoryDto } from '../types/attendance.types';
import type { MemberType } from '../../Salaries/types/enums.types';
import type { ApiError } from '@/types/api-error.types';
import { absenceKeys } from '@/modules/Absence/hooks/useAbsence';

export const attendanceKeys = {
  all: ['attendance'] as const,
  byDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    [...attendanceKeys.all, branchId, departmentId, { pageNumber, take }] as const,
  history: (branchId: string, memberType: MemberType, pageNumber: number, take: number) =>
    [...attendanceKeys.all, 'history', branchId, memberType, { pageNumber, take }] as const,
};

export function useAttendanceHistory(branchId: string, memberType: MemberType, pageNumber: number, take: number) {
  return useQuery({
    queryKey: attendanceKeys.history(branchId, memberType, pageNumber, take),
    queryFn: () => attendanceService.getHistory(branchId, memberType, pageNumber, take),
    enabled: !!branchId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAddMemberAttendance(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddAttendanceHistoryDto) => attendanceService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success('تم تسجيل الحضور بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

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

const BULK_CHUNK_SIZE = 5;

export function useAddBulkAttendance(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      departmentId,
      childIds,
      dateTime,
      lateMinutes,
    }: {
      departmentId: string;
      childIds: string[];
      dateTime: string;
      lateMinutes?: number;
    }) => {
      const failedIds: string[] = [];

      for (let i = 0; i < childIds.length; i += BULK_CHUNK_SIZE) {
        const chunk = childIds.slice(i, i + BULK_CHUNK_SIZE);
        const results = await Promise.allSettled(
          chunk.map((childId) =>
            attendanceService.addForDepartmentChild(branchId, departmentId, childId, dateTime, lateMinutes)
          )
        );
        results.forEach((r, idx) => {
          if (r.status === 'rejected') failedIds.push(chunk[idx]);
        });
      }

      return { total: childIds.length, succeeded: childIds.length - failedIds.length, failedIds };
    },
    onSuccess: ({ total, succeeded, failedIds }) => {
      qc.invalidateQueries({ queryKey: attendanceKeys.all });
      if (failedIds.length === 0) {
        toast.success(total === 1 ? 'تم تسجيل الحضور بنجاح' : `تم تسجيل حضور ${succeeded} طالب بنجاح`);
      } else if (succeeded === 0) {
        toast.error('فشل تسجيل الحضور');
      } else {
        toast.warning(`تم تسجيل ${succeeded} وفشل تسجيل ${failedIds.length}`);
      }
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useMarkAttendanceByClassroom(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      classroomId,
      absentStudentIds,
      dateTime,
      lateMinutes,
    }: {
      classroomId: string;
      absentStudentIds: string[];
      dateTime: string;
      lateMinutes?: number;
    }) => attendanceService.markByClassroom(branchId, classroomId, absentStudentIds, dateTime, lateMinutes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attendanceKeys.all });
      qc.invalidateQueries({ queryKey: absenceKeys.all });
      toast.success('تم تسجيل الغياب للمختارين والحضور لباقي طلاب الفصل');
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