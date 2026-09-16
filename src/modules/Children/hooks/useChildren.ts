import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { childService } from '../services/childService';
import { childrenKeys } from '@/constants/queryKeys.constants';
import type { Period } from '@/types/enums.types';
import type { AddChildDto, UpdateChildDto } from '../types/child.types';
import type { ApiError } from '@/types/api-error.types';

export function useChildrenList(
  branchId: string,
  departmentId: string,
  period: Period,
  pageNumber: number,
  take: number,
  name?: string
) {
  return useQuery({
    queryKey: childrenKeys.list(branchId, departmentId, period, pageNumber, take, name),
    queryFn: () => childService.getList(branchId, departmentId, period, pageNumber, take, name),
    enabled: !!branchId && !!departmentId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useChild(branchId: string, id: string | undefined) {
  return useQuery({
    queryKey: childrenKeys.detail(branchId, id ?? ''),
    queryFn: () => childService.getById(branchId, id!),
    enabled: !!branchId && !!id,
    staleTime: 0,
  });
}

export function useChildrenArchive(
  branchId: string,
  departmentId: string,
  period: Period,
  pageNumber: number,
  take: number,
  name?: string
) {
  return useQuery({
    queryKey: childrenKeys.archive(branchId, departmentId, period, pageNumber, take, name),
    queryFn: () => childService.getArchive(branchId, departmentId, period, pageNumber, take, name),
    enabled: !!branchId && !!departmentId,
    staleTime: 30_000,
  });
}

export function useChildrenBirthdays(branchId: string, departmentId: string, period: Period, pageNumber: number, take: number) {
  return useQuery({
    queryKey: childrenKeys.birthdays(branchId, departmentId, period, pageNumber, take),
    queryFn: () => childService.getBirthdays(branchId, departmentId, period, pageNumber, take),
    enabled: !!branchId && !!departmentId,
    staleTime: 60_000,
  });
}

export function useDepartmentChildren(branchId: string, departmentId: string, period: Period) {
  return useQuery({
    queryKey: childrenKeys.departmentChildren(branchId, departmentId, period),
    queryFn: () => childService.getDepartmentChildren(branchId, departmentId, period),
    enabled: !!branchId && !!departmentId,
    staleTime: 30_000,
  });
}

export function useCreateChild(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddChildDto) => childService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
      toast.success('تم إضافة الطالب بنجاح، وسيظهر تلقائيًا في تقييم اليوم');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateChild(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateChildDto) => childService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
      toast.success('تم تعديل بيانات الطالب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteChild(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (childId: string) => childService.remove(branchId, childId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
      toast.success('تم حذف الطالب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** أرشفة/إلغاء أرشفة — منفصلة تمامًا عن الحذف (راجع 03-Business-Flow.md § Children Flow) */
export function useSetChildActive(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      childService.setActive(branchId, id, isActive),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: childrenKeys.all });
      toast.success(variables.isActive ? 'تم إلغاء أرشفة الطالب بنجاح' : 'تم أرشفة الطالب بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}