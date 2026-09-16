import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { brotherService } from '../services/brotherService';
import type { AddBrotherInfoDto, UpdateBrotherInfoDto } from '../types/brother.types';
import type { ApiError } from '@/types/api-error.types';

export const brotherKeys = {
  all: ['brothers'] as const,
  byChild: (childId: string) => [...brotherKeys.all, 'byChild', childId] as const,
};

export function useBrothersByChild(childId: string) {
  return useQuery({
    queryKey: brotherKeys.byChild(childId),
    queryFn: () => brotherService.getByChild(childId),
    enabled: !!childId,
    staleTime: 2 * 60_000,
  });
}

export function useCreateBrother() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddBrotherInfoDto) => brotherService.add(dto),
    onSuccess: (_d, variables) => {
      qc.invalidateQueries({ queryKey: brotherKeys.byChild(variables.childId) });
      toast.success('تم إضافة الأخ/الأخت بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateBrother(childId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateBrotherInfoDto) => brotherService.update(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brotherKeys.byChild(childId) });
      toast.success('تم تعديل البيانات بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteBrother(childId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brotherService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brotherKeys.byChild(childId) });
      toast.success('تم الحذف بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
