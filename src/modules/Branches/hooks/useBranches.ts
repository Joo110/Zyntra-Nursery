import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { branchService } from '../services/branchService';
import { branchKeys } from '@/constants/queryKeys.constants';
import type { AddBranchDto, UpdateBranchDto } from '../types/branch.types';
import type { ApiError } from '@/types/api-error.types';

/** راجع 05-Caching-Pagination-Search-Filtering.md: Branches staleTime طويل (10 دقائق) - بيانات شبه ثابتة */
export function useBranchesList(pageNumber: number, take: number, searchName?: string) {
  return useQuery({
    queryKey: branchKeys.list(pageNumber, take, searchName),
    queryFn: () => branchService.getList(pageNumber, take, searchName),
    staleTime: 10 * 60_000,
  });
}

export function useBranchesDropdown() {
  return useQuery({
    queryKey: branchKeys.dropdown(),
    queryFn: () => branchService.getDropdown(),
    staleTime: 10 * 60_000,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddBranchDto) => branchService.add(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success('تم إضافة الفرع بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateBranchDto) => branchService.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success('تم تعديل بيانات الفرع بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branchId: string) => branchService.remove(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success('تم حذف الفرع بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
