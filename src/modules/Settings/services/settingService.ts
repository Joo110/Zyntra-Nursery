import { axiosInstance } from '@/services/api/axiosInstance';
import type { MessageResponse } from '@/types/pagination.types';
import type { SettingDto, UpdateSettingDto } from '../types/setting.types';

/** راجع SettingController بالباك (GET /Setting, PUT /Setting, backup/restore) */
export const settingService = {
  get: () => axiosInstance.get<SettingDto>('/Setting').then((res) => res.data),

  update: (dto: UpdateSettingDto) =>
    axiosInstance.put<MessageResponse>('/Setting', dto).then((res) => res.data),

  /**
   * السيرفر بيحدد مسار قاعدة البيانات ومجلد النسخ الاحتياطي داخليًا.
   * backupName اختياري ووصفي بس (مفيش مسارات بتتبعت من العميل).
   */
  backupDatabase: (backupName?: string) =>
    axiosInstance
      .post<MessageResponse>('/Setting/backup-database', null, { params: backupName ? { backupName } : undefined })
      .then((res) => res.data),

  /**
   * fileName هو اسم الملف فقط (مش مسار كامل) — السيرفر بيحدد مجلد الـ Backups
   * المسموح بيه عشان يمنع Path Traversal (راجع Issue #8).
   */
  restoreDatabase: (fileName: string) =>
    axiosInstance
      .post<MessageResponse>('/Setting/restore-database', null, { params: { fileName } })
      .then((res) => res.data),
};