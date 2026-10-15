import { axiosInstance } from '@/services/api/axiosInstance';
import type { MessageResponse } from '@/types/pagination.types';
import type { SettingDto, UpdateSettingDto } from '../types/setting.types';

export const settingService = {
  get: () => axiosInstance.get<SettingDto>('/Setting').then((res) => res.data),

  update: (dto: UpdateSettingDto) =>
    axiosInstance.put<MessageResponse>('/Setting', dto).then((res) => res.data),

  backupDatabase: (backupName?: string) =>
    axiosInstance
      .post<MessageResponse>('/Setting/backup-database', null, { params: backupName ? { backupName } : undefined })
      .then((res) => res.data),

  restoreDatabase: (fileName: string) =>
    axiosInstance
      .post<MessageResponse>('/Setting/restore-database', null, { params: { fileName } })
      .then((res) => res.data),
};