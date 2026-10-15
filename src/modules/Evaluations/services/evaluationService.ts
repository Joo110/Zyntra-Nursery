import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { Period } from '@/types/enums.types';
import type {
  EvaluationInfoDto,
  EvaluationAverageDto,
  WinnerHistoryDto,
  WinnerCardDto,
  UpdateDayEvaluationDto,
} from '../types/evaluation.types';

export const evaluationService = {
  getInfo: (branchId: string, classId: string, period: Period, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<EvaluationInfoDto>>(`/branches/${branchId}/Evaluations/info`, {
        params: { classId, period, pageNumber, take },
      })
      .then((res) => res.data),

  getAverage: (branchId: string, period: Period, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<EvaluationAverageDto>>(`/branches/${branchId}/Evaluations/average`, {
        params: { period, pageNumber, take },
      })
      .then((res) => res.data),

  getWinnerHistory: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<WinnerHistoryDto>>(`/branches/${branchId}/Evaluations/winners/history`, {
        params: { pageNumber, take },
      })
      .then((res) => res.data),

  getWinnerCard: (branchId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<WinnerCardDto>>(`/branches/${branchId}/Evaluations/winners/card`, {
        params: { pageNumber, take },
      })
      .then((res) => res.data),

  resetDaily: (branchId: string) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Evaluations/reset-daily`).then((res) => res.data),

  truncateWinnerHistory: (branchId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Evaluations/winners/history`).then((res) => res.data),

  saveWinners: (branchId: string) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Evaluations/winners/save`).then((res) => res.data),

  update: (branchId: string, dto: UpdateDayEvaluationDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Evaluations`, dto).then((res) => res.data),

  remove: (branchId: string, evaluationId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Evaluations/${evaluationId}`).then((res) => res.data),
};