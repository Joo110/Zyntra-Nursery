import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { busService } from '../services/busService';
import type { AddBusDto, UpdateBusDto } from '../types/bus.types';
import type { ApiError } from '@/types/api-error.types';

export const busKeys = {
  all: ['buses'] as const,
  lists: (branchId: string) => [...busKeys.all, 'list', branchId] as const,
  list: (branchId: string, pageNumber: number, take: number, searchName?: string) =>
    [...busKeys.lists(branchId), { pageNumber, take, searchName }] as const,
  dropdown: (branchId: string) => [...busKeys.all, 'dropdown', branchId] as const,
};

export function useBusesList(branchId: string, pageNumber: number, take: number, searchName?: string) {
  return useQuery({
    queryKey: busKeys.list(branchId, pageNumber, take, searchName),
    queryFn: () => busService.getList(branchId, pageNumber, take, searchName),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

export function useBusesDropdown(branchId: string) {
  return useQuery({
    queryKey: busKeys.dropdown(branchId),
    queryFn: () => busService.getDropdown(branchId),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

export function useCreateBus(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddBusDto) => busService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: busKeys.all });
      toast.success('تم إضافة الباص بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateBus(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateBusDto) => busService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: busKeys.all });
      toast.success('تم تعديل بيانات الباص بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteBus(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (busId: string) => busService.remove(branchId, busId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: busKeys.all });
      toast.success('تم حذف الباص بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
