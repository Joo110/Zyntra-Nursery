import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingService } from '../services/settingService';
import type { UpdateSettingDto } from '../types/setting.types';
import type { ApiError } from '@/types/api-error.types';

export const settingKeys = { all: ['settings'] as const };

export function useSettings() {
  return useQuery({
    queryKey: settingKeys.all,
    queryFn: () => settingService.get(),
    staleTime: 10 * 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSettingDto) => settingService.update(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.all, refetchType: 'all' });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** POST /Setting/backup-database */
export function useBackupDatabase() {
  return useMutation({
    mutationFn: (backupName?: string) => settingService.backupDatabase(backupName),
    onSuccess: () => toast.success('تم إنشاء نسخة احتياطية من قاعدة البيانات بنجاح'),
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** POST /Setting/restore-database */
export function useRestoreDatabase() {
  return useMutation({
    mutationFn: (fileName: string) => settingService.restoreDatabase(fileName),
    onSuccess: () => toast.success('تم استعادة قاعدة البيانات بنجاح — قد تحتاج لإعادة تحميل الصفحة'),
    onError: (e: ApiError) => toast.error(e.message),
  });
}