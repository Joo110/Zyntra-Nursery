import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departureService } from '../services/departureService';
import type { ApiError } from '@/types/api-error.types';

export const departureKeys = {
  all: ['departure'] as const,
  byDepartment: (branchId: string, departmentId: string, pageNumber: number, take: number) =>
    [...departureKeys.all, branchId, departmentId, { pageNumber, take }] as const,
};

export function useDepartureByDepartment(branchId: string, departmentId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: departureKeys.byDepartment(branchId, departmentId, pageNumber, take),
    queryFn: () => departureService.getByDepartment(branchId, departmentId, pageNumber, take),
    enabled: !!branchId && !!departmentId,
    staleTime: 0,
  });
}

export function useAddDeparture(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, childId, dateTime }: { departmentId: string; childId: string; dateTime: string }) =>
      departureService.addForDepartmentChild(branchId, departmentId, childId, dateTime),
    onSuccess: () => { qc.invalidateQueries({ queryKey: departureKeys.all }); toast.success('تم تسجيل الانصراف بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

const BULK_CHUNK_SIZE = 5;

export function useAddBulkDeparture(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      departmentId,
      childIds,
      dateTime,
    }: {
      departmentId: string;
      childIds: string[];
      dateTime: string;
    }) => {
      const failedIds: string[] = [];

      for (let i = 0; i < childIds.length; i += BULK_CHUNK_SIZE) {
        const chunk = childIds.slice(i, i + BULK_CHUNK_SIZE);
        const results = await Promise.allSettled(
          chunk.map((childId) => departureService.addForDepartmentChild(branchId, departmentId, childId, dateTime))
        );
        results.forEach((r, idx) => {
          if (r.status === 'rejected') failedIds.push(chunk[idx]);
        });
      }

      return { total: childIds.length, succeeded: childIds.length - failedIds.length, failedIds };
    },
    onSuccess: ({ total, succeeded, failedIds }) => {
      qc.invalidateQueries({ queryKey: departureKeys.all });
      if (failedIds.length === 0) {
        toast.success(total === 1 ? 'تم تسجيل الانصراف بنجاح' : `تم تسجيل انصراف ${succeeded} طالب بنجاح`);
      } else if (succeeded === 0) {
        toast.error('فشل تسجيل الانصراف');
      } else {
        toast.warning(`تم تسجيل ${succeeded} وفشل تسجيل ${failedIds.length}`);
      }
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useAddBulkDepartureToday(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dateTime: string) => departureService.addBulkToday(branchId, dateTime),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: departureKeys.all });
      toast.success(res.insertedCount > 0 ? `تم تسجيل انصراف ${res.insertedCount} بنجاح` : 'تم تسجيل الانصراف بنجاح');
    },
    onError: (e: ApiError) => {
      if (e.status === 400) toast.error('لا يوجد حضور مسجل اليوم، أو تم تسجيل انصراف جميع الحاضرين بالفعل');
      else toast.error(e.message);
    },
  });
}

export function useDeleteDeparture(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departureService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: departureKeys.all }); toast.success('تم حذف السجل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAllDeparture(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => departureService.removeAll(branchId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: departureKeys.all }); toast.success('تم حذف جميع سجلات الانصراف'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}