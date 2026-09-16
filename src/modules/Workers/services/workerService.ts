import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type { WorkerListDto, WorkerDetailsDto, AddWorkerDto, UpdateWorkerDto } from '../types/worker.types';

export const workerService = {
  getList: (branchId: string, pageNumber: number, take: number, name?: string) =>
    axiosInstance
      .get<PagedResult<WorkerListDto>>(`/branches/${branchId}/Worker/list`, { params: { pageNumber, take, name } })
      .then((res) => res.data),

  getById: (branchId: string, id: string) =>
    axiosInstance
      .get<WorkerDetailsDto>(`/branches/${branchId}/Worker/${id}`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddWorkerDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Worker`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateWorkerDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Worker`, dto).then((res) => res.data),

  remove: (branchId: string, workerId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Worker/${workerId}`).then((res) => res.data),
};