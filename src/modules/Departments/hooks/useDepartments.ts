import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/departmentService';
import { departmentKeys } from '@/constants/queryKeys.constants';
import type { AddDepartmentDto, UpdateDepartmentDto } from '../types/department.types';
import type { ApiError } from '@/types/api-error.types';

export function useDepartmentsList(branchId: string, pageNumber: number, take: number, searchName?: string) {
  return useQuery({
    queryKey: departmentKeys.list(branchId, pageNumber, take, searchName),
    queryFn: () => departmentService.getList(branchId, pageNumber, take, searchName),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useDepartmentsDropdown(branchId: string) {
  return useQuery({
    queryKey: departmentKeys.dropdown(branchId),
    queryFn: () => departmentService.getDropdown(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useTodayDepartmentsDropdown(branchId: string, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.absenceDropdown(branchId),
    queryFn: () => departmentService.getDropdownForAbsence(branchId),
    enabled: !!branchId && enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useIsPrimaryDepartment(branchId: string, departmentId: string) {
  const { data, isLoading } = useDepartmentsList(branchId, 1, 100);
  const isPrimary = !!departmentId && (data?.items ?? []).some((d) => d.id === departmentId && d.isPrimaryDepartment);
  return { isPrimary, isLoading };
}

export function useDepartmentFinancialStats(branchId: string, departmentId: string) {
  return useQuery({
    queryKey: departmentKeys.financialStats(branchId, departmentId),
    queryFn: () => departmentService.getFinancialStats(branchId, departmentId),
    enabled: !!branchId && !!departmentId,
    staleTime: 30_000,
  });
}

export function useCreateDepartment(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddDepartmentDto) => departmentService.add(branchId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('تم إضافة القسم بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateDepartment(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDepartmentDto) => departmentService.update(branchId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('تم تعديل بيانات القسم بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useDeleteDepartment(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (departmentId: string) => departmentService.remove(branchId, departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('تم حذف القسم بنجاح');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
