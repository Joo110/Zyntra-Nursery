import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { messageArchiveService } from '../services/messageArchiveService';
import type { AddMessageArchiveDto } from '../types/messageArchive.types';
import type { ApiError } from '@/types/api-error.types';

export const messageArchiveKeys = {
  all: ['message-archive'] as const,
  list: (branchId: string, pageNumber: number, take: number) => [...messageArchiveKeys.all, branchId, { pageNumber, take }] as const,
};

export function useMessageArchiveList(branchId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: messageArchiveKeys.list(branchId, pageNumber, take),
    queryFn: () => messageArchiveService.getList(branchId, pageNumber, take),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

export function useCreateMessageArchive(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddMessageArchiveDto) => messageArchiveService.add(branchId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: messageArchiveKeys.all }); toast.success('تم تسجيل الرسالة بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteMessageArchive(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messageArchiveService.remove(branchId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: messageArchiveKeys.all }); toast.success('تم حذف السجل بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
