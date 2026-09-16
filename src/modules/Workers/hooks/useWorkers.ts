import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workerService } from '../services/workerService';
import type { AddWorkerDto, UpdateWorkerDto } from '../types/worker.types';
import type { ApiError } from '@/types/api-error.types';

export const workerKeys = {
  all: ['workers'] as const,
  list: (branchId: string, pageNumber: number, take: number, name?: string) =>
    [...workerKeys.all, branchId, { pageNumber, take, name }] as const,
  detail: (branchId: string, id: string) => [...workerKeys.all, 'detail', branchId, id] as const,
};

export function useWorkersList(branchId: string, pageNumber: number, take: number, name?: string) {
  return useQuery({
    queryKey: workerKeys.list(branchId, pageNumber, take, name),
    queryFn: () => workerService.getList(branchId, pageNumber, take, name),
    enabled: !!branchId,
    staleTime: 2 * 60_000,
  });
}

/** جلب بيانات عامل واحد بالتفصيل (للعرض/التعديل) */
export function useWorker(branchId: string, id: string | undefined) {
  return useQuery({
    queryKey: workerKeys.detail(branchId, id ?? ''),
    queryFn: () => workerService.getById(branchId, id!),
    enabled: !!branchId && !!id,
    staleTime: 0,
  });
}

export function useCreateWorker(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddWorkerDto) => workerService.add(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: workerKeys.all }); toast.success('تم إضافة العامل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateWorker(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateWorkerDto) => workerService.update(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: workerKeys.all }); toast.success('تم تعديل بيانات العامل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteWorker(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workerService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: workerKeys.all }); toast.success('تم حذف العامل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}