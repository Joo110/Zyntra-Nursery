import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { graduationService } from '../services/graduationService';
import type { AddGraduationDto, UpdateGraduationDto } from '../types/graduation.types';
import type { ApiError } from '@/types/api-error.types';

export const graduationKeys = { all: (branchId: string) => ['graduation', branchId] as const };

export function useGraduationList(branchId: string) {
  return useQuery({
    queryKey: graduationKeys.all(branchId),
    queryFn: () => graduationService.getAll(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCreateGraduation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddGraduationDto) => graduationService.add(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: graduationKeys.all(branchId) }); toast.success('تمت الإضافة بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateGraduation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateGraduationDto) => graduationService.update(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: graduationKeys.all(branchId) }); toast.success('تم التعديل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteGraduation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => graduationService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: graduationKeys.all(branchId) }); toast.success('تم الحذف بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
