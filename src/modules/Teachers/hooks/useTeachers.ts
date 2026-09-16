import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { teacherService } from '../services/teacherService';
import type { AddTeacherDto, UpdateTeacherDto } from '../types/teacher.types';
import type { ApiError } from '@/types/api-error.types';

export const teacherKeys = {
  all: ['teachers'] as const,
  list: (branchId: string, pageNumber: number, take: number, search?: string) =>
    [...teacherKeys.all, branchId, { pageNumber, take, search }] as const,
  detail: (branchId: string, id: string) => [...teacherKeys.all, 'detail', branchId, id] as const,
};

export function useTeachersList(branchId: string, pageNumber: number, take: number, searchName?: string) {
  return useQuery({
    queryKey: teacherKeys.list(branchId, pageNumber, take, searchName),
    queryFn: () => (searchName ? teacherService.search(branchId, pageNumber, take, searchName) : teacherService.getList(branchId, pageNumber, take)),
    enabled: !!branchId,
    staleTime: 2 * 60_000,
  });
}

/** جلب بيانات معلم واحد بالتفصيل (للعرض/التعديل) */
export function useTeacher(branchId: string, id: string | undefined) {
  return useQuery({
    queryKey: teacherKeys.detail(branchId, id ?? ''),
    queryFn: () => teacherService.getById(branchId, id!),
    enabled: !!branchId && !!id,
    staleTime: 0,
  });
}

export function useCreateTeacher(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddTeacherDto) => teacherService.add(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: teacherKeys.all }); toast.success('تم إضافة المعلم بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateTeacher(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateTeacherDto) => teacherService.update(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: teacherKeys.all }); toast.success('تم تعديل بيانات المعلم بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteTeacher(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: teacherKeys.all }); toast.success('تم حذف المعلم بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}