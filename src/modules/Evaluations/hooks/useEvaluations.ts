import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { evaluationService } from '../services/evaluationService';
import type { Period } from '@/types/enums.types';
import type { ApiError } from '@/types/api-error.types';
import type { UpdateDayEvaluationDto } from '../types/evaluation.types';

export const evaluationKeys = {
  all: ['evaluations'] as const,
  info: (branchId: string, classId: string, period: Period, pageNumber: number, take: number) =>
    [...evaluationKeys.all, 'info', branchId, classId, period, { pageNumber, take }] as const,
  average: (branchId: string, period: Period, pageNumber: number, take: number) =>
    [...evaluationKeys.all, 'average', branchId, period, { pageNumber, take }] as const,
  winnerHistory: (branchId: string, pageNumber: number, take: number) =>
    [...evaluationKeys.all, 'winner-history', branchId, { pageNumber, take }] as const,
  winnerCard: (branchId: string, pageNumber: number, take: number) =>
    [...evaluationKeys.all, 'winner-card', branchId, { pageNumber, take }] as const,
};

export function useEvaluationInfo(branchId: string, classId: string, period: Period, pageNumber: number, take: number) {
  return useQuery({
    queryKey: evaluationKeys.info(branchId, classId, period, pageNumber, take),
    queryFn: () => evaluationService.getInfo(branchId, classId, period, pageNumber, take),
    enabled: !!branchId && !!classId,
    staleTime: 0,
  });
}

export function useEvaluationAverage(branchId: string, period: Period, pageNumber = 1, take = 10) {
  return useQuery({
    queryKey: evaluationKeys.average(branchId, period, pageNumber, take),
    queryFn: () => evaluationService.getAverage(branchId, period, pageNumber, take),
    enabled: !!branchId,
  });
}

export function useWinnerHistory(branchId: string, pageNumber = 1, take = 20) {
  return useQuery({
    queryKey: evaluationKeys.winnerHistory(branchId, pageNumber, take),
    queryFn: () => evaluationService.getWinnerHistory(branchId, pageNumber, take),
    enabled: !!branchId,
  });
}

export function useWinnerCard(branchId: string, pageNumber = 1, take = 20) {
  return useQuery({
    queryKey: evaluationKeys.winnerCard(branchId, pageNumber, take),
    queryFn: () => evaluationService.getWinnerCard(branchId, pageNumber, take),
    enabled: !!branchId,
  });
}

export function useUpdateEvaluation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDayEvaluationDto) => evaluationService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: evaluationKeys.all });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteEvaluation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluationService.remove(branchId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: evaluationKeys.all });
      toast.success('تم حذف سجل التقييم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useResetDailyEvaluation(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => evaluationService.resetDaily(branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: evaluationKeys.all });
      toast.success('تم تصفير تقييمات اليوم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useSaveWinners(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => evaluationService.saveWinners(branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: evaluationKeys.all });
      toast.success('تم حفظ الفائزين بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useTruncateWinnerHistory(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => evaluationService.truncateWinnerHistory(branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: evaluationKeys.all });
      toast.success('تم مسح سجل الفائزين بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

// Aliases للتوافق مع الأسماء المستخدمة في EvaluationsWinnersPage
export const useWinnersCard = useWinnerCard;
export const useWinnersHistory = useWinnerHistory;