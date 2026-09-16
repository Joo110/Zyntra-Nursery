import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { classroomService } from '../services/classroomService';
import { classroomKeys } from '@/constants/queryKeys.constants';
import type { AddClassroomDto, UpdateClassroomDto } from '../types/classroom.types';
import type { ApiError } from '@/types/api-error.types';

export function useClassroomsList(branchId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: classroomKeys.list(branchId, pageNumber, take),
    queryFn: () => classroomService.getList(branchId, pageNumber, take),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCreateClassroom(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddClassroomDto) => classroomService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classroomKeys.all });
      toast.success('تم إضافة الفصل بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateClassroom(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateClassroomDto) => classroomService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classroomKeys.all });
      toast.success('تم تعديل بيانات الفصل بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteClassroom(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classroomService.remove(branchId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classroomKeys.all });
      toast.success('تم حذف الفصل بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
