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
