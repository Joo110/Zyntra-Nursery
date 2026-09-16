import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerService } from '../services/registerService';
import type { ApiError } from '@/types/api-error.types';

export const registerKeys = {
  all: ['registers-operation'] as const,
  list: (pageNumber: number, take: number) => [...registerKeys.all, { pageNumber, take }] as const,
};

export function useRegistersList(pageNumber: number, take: number) {
  return useQuery({
    queryKey: registerKeys.list(pageNumber, take),
    queryFn: () => registerService.getList(pageNumber, take),
    staleTime: 60_000,
  });
}

export function useDeleteAllRegisters() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => registerService.removeAll(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: registerKeys.all }); toast.success('تم حذف كل السجلات بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
