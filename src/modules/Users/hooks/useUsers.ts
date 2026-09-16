import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '../services/userService';
import { userKeys } from '@/constants/queryKeys.constants';
import type { AddUserDto } from '../types/user.types';
import type { ApiError } from '@/types/api-error.types';

export function useUsersList() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getAll(),
    staleTime: 2 * 60_000,
  });
}

export function useUserStatistics() {
  return useQuery({
    queryKey: userKeys.statistics(),
    queryFn: () => userService.getStatistics(),
    staleTime: 2 * 60_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddUserDto) => userService.add(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: userKeys.all }); toast.success('تم إضافة المستخدم بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userService.remove(userId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: userKeys.all }); toast.success('تم حذف المستخدم بنجاح'); },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, activate }: { userId: string; activate: boolean }) =>
      activate ? userService.activate(userId) : userService.deactivate(userId),
    onSuccess: (_d, variables) => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success(variables.activate ? 'تم تفعيل المستخدم بنجاح' : 'تم تعطيل المستخدم بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}
