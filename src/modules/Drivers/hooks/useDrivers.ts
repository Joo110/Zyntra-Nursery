import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { driverService } from '../services/driverService';
import type { AddDriverDto, UpdateDriverDto } from '../types/driver.types';
import type { ApiError } from '@/types/api-error.types';

export const driverKeys = {
  all: ['drivers'] as const,
  lists: (branchId: string) => [...driverKeys.all, 'list', branchId] as const,
  list: (branchId: string, pageNumber: number, take: number) =>
    [...driverKeys.lists(branchId), { pageNumber, take }] as const,
  dropdown: (branchId: string) => [...driverKeys.all, 'dropdown', branchId] as const,
  detail: (branchId: string, id: string) => [...driverKeys.all, 'detail', branchId, id] as const,
};

export function useDriversList(branchId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: driverKeys.list(branchId, pageNumber, take),
    queryFn: () => driverService.getList(branchId, pageNumber, take),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

export function useDriversDropdown(branchId: string) {
  return useQuery({
    queryKey: driverKeys.dropdown(branchId),
    queryFn: () => driverService.getDropdown(branchId),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

export function useDriver(branchId: string, id: string | undefined) {
  return useQuery({
    queryKey: driverKeys.detail(branchId, id ?? ''),
    queryFn: () => driverService.getById(branchId, id!),
    enabled: !!branchId && !!id,
    staleTime: 0,
  });
}

export function useCreateDriver(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddDriverDto) => driverService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: driverKeys.all });
      toast.success('تم إضافة السائق بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateDriver(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDriverDto) => driverService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: driverKeys.all });
      toast.success('تم تعديل بيانات السائق بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteDriver(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (driverId: string) => driverService.remove(branchId, driverId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: driverKeys.all });
      toast.success('تم حذف السائق بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}