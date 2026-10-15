import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingService } from '../services/settingService';
import type { UpdateSettingDto } from '../types/setting.types';
import type { ApiError } from '@/types/api-error.types';
import {
  SCHEDULE_CACHE_TTL_MS,
  clearScheduleCache,
  pickScheduleSettings,
  readScheduleCache,
  writeScheduleCache,
} from '../utils/scheduleCache';

export const settingKeys = { all: ['settings'] as const };

export function useSettings() {
  return useQuery({
    queryKey: settingKeys.all,
    queryFn: () => settingService.get(),
    staleTime: 10 * 60_000,
  });
}

export const scheduleSettingKeys = { all: [...settingKeys.all, 'schedule'] as const };

export function useScheduleSettings() {
  const [cached] = useState(readScheduleCache);
  return useQuery({
    queryKey: scheduleSettingKeys.all,
    queryFn: async () => {
      const full = await settingService.get();
      const schedule = pickScheduleSettings(full);
      writeScheduleCache(schedule);
      return schedule;
    },
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.fetchedAt,
    staleTime: SCHEDULE_CACHE_TTL_MS,
    gcTime: SCHEDULE_CACHE_TTL_MS,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSettingDto) => settingService.update(dto),
    onSuccess: () => {
      clearScheduleCache();
      qc.invalidateQueries({ queryKey: settingKeys.all, refetchType: 'all' });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useBackupDatabase() {
  return useMutation({
    mutationFn: (backupName?: string) => settingService.backupDatabase(backupName),
    onSuccess: () => toast.success('تم إنشاء نسخة احتياطية من قاعدة البيانات بنجاح'),
    onError: (e: ApiError) => toast.error(e.message),
  });
}

export function useRestoreDatabase() {
  return useMutation({
    mutationFn: (fileName: string) => settingService.restoreDatabase(fileName),
    onSuccess: () => toast.success('تم استعادة قاعدة البيانات بنجاح — قد تحتاج لإعادة تحميل الصفحة'),
    onError: (e: ApiError) => toast.error(e.message),
  });
}