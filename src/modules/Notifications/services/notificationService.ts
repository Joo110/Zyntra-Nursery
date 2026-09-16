import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult } from '@/types/pagination.types';
import type { Period } from '@/types/enums.types';

/**
 * راجع ملاحظة الـ Gap في types/notification.types.ts — دي Endpoints موجودة فعليًا بالباك
 * ونستخدمها كحل مؤقت لحد ما يتوفر Endpoint موحّد للتنبيهات الأربعة.
 */
export const notificationService = {
  checkBirthdays: (branchId: string, departmentId: string, period: Period) =>
    axiosInstance
      .get<boolean>(`/branches/${branchId}/Child/check-birthdays`, { params: { departmentId, period } })
      .then((res) => res.data),

  hasUnpaidSubscriptions: (branchId: string, period: Period) =>
    axiosInstance
      .get<PagedResult<unknown>>(`/branches/${branchId}/Subscriptions/unpaid-subscriptions`, {
        params: { period, pageNumber: 1, take: 1 },
      })
      .then((res) => res.data.totalCount > 0),

  /**
   * حين يتوفر Endpoint pending-alerts الموحّد بالباك، استبدل useNotificationAlerts بالكامل
   * بنداء واحد لهذه الدالة بدل التجميع اليدوي الحالي:
   *
   * getPendingAlerts: (branchId: string) =>
   *   axiosInstance.get<NotificationAlertsDto>(`/branches/${branchId}/notifications/pending-alerts`).then((res) => res.data),
   */
};
