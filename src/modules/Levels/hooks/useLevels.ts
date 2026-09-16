import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { levelService } from '../services/levelService';
import { levelKeys } from '@/constants/queryKeys.constants';
import type { AddLevelDto, UpdateLevelDto } from '../types/level.types';
import type { ApiError } from '@/types/api-error.types';

export function useLevelsList(branchId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: levelKeys.list(branchId, pageNumber, take),
    queryFn: () => levelService.getList(branchId, pageNumber, take),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCreateLevel(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddLevelDto) => levelService.add(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: levelKeys.all }); toast.success('تم إضافة المستوى بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateLevel(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateLevelDto) => levelService.update(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: levelKeys.all }); toast.success('تم تعديل بيانات المستوى بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteLevel(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => levelService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: levelKeys.all }); toast.success('تم حذف المستوى بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
