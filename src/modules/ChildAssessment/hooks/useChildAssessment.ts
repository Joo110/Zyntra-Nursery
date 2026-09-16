import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { childAssessmentService } from '../services/childAssessmentService';
import type { AddChildAssessmentDto, UpdateChildAssessmentDto } from '../types/childAssessment.types';
import type { ApiError } from '@/types/api-error.types';

export const childAssessmentKeys = {
  all: ['child-assessments'] as const,
  history: (branchId: string, childId: string, departmentId: string) =>
    [...childAssessmentKeys.all, 'history', branchId, childId, departmentId] as const,
  latest: (branchId: string, childId: string, departmentId: string) =>
    [...childAssessmentKeys.all, 'latest', branchId, childId, departmentId] as const,
  progress: (branchId: string, childId: string, departmentId: string) =>
    [...childAssessmentKeys.all, 'progress', branchId, childId, departmentId] as const,
  completeProgress: (branchId: string, childId: string) =>
    [...childAssessmentKeys.all, 'complete-progress', branchId, childId] as const,
  allForChild: (branchId: string, childId: string) =>
    [...childAssessmentKeys.all, 'for-child', branchId, childId] as const,
};

export function useAssessmentHistory(branchId: string, childId: string, departmentId: string) {
  return useQuery({
    queryKey: childAssessmentKeys.history(branchId, childId, departmentId),
    queryFn: () => childAssessmentService.getHistory(branchId, childId, departmentId),
    enabled: !!branchId && !!childId && !!departmentId,
    staleTime: 30_000,
  });
}

export function useLatestAssessment(branchId: string, childId: string, departmentId: string) {
  return useQuery({
    queryKey: childAssessmentKeys.latest(branchId, childId, departmentId),
    queryFn: () => childAssessmentService.getLatest(branchId, childId, departmentId),
    enabled: !!branchId && !!childId && !!departmentId,
    staleTime: 30_000,
    retry: false,
  });
}

export function useChildCompleteProgress(branchId: string, childId: string) {
  return useQuery({
    queryKey: childAssessmentKeys.completeProgress(branchId, childId),
    queryFn: () => childAssessmentService.getCompleteProgress(branchId, childId),
    enabled: !!branchId && !!childId,
    staleTime: 30_000,
  });
}

export function useAllAssessmentsForChild(branchId: string, childId: string) {
  return useQuery({
    queryKey: childAssessmentKeys.allForChild(branchId, childId),
    queryFn: () => childAssessmentService.getAllForChild(branchId, childId),
    enabled: !!branchId && !!childId,
    staleTime: 30_000,
    retry: false,
  });
}

export function useCreateAssessment(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddChildAssessmentDto) => childAssessmentService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childAssessmentKeys.all });
      toast.success('تم تسجيل التقييم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useUpdateAssessment(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateChildAssessmentDto) => childAssessmentService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childAssessmentKeys.all });
      toast.success('تم تعديل التقييم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteAssessment(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: string) => childAssessmentService.remove(branchId, assessmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: childAssessmentKeys.all });
      toast.success('تم حذف التقييم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
