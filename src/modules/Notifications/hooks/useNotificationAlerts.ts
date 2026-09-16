import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { NO_ALERTS, type NotificationAlertsDto } from '../types/notification.types';
import { useDepartmentsDropdown } from '@/modules/Departments/hooks/useDepartments';
import { Period } from '@/types/enums.types';

/**
 * يفحص حالات التنبيه الأربعة المطلوبة (راجع خطة الفرونت § نظام الإشعارات):
 * - أعياد الميلاد ✅ Endpoint حقيقي موجود
 * - عدم الدفع ✅ Endpoint حقيقي موجود
 * - سن الأخ ⚠️ غير متاح بالباك حاليًا (يرجع false دائمًا)
 * - تجاوز حد الغياب ⚠️ غير متاح بالباك حاليًا (يرجع false دائمًا)
 *
 * التنفيذ الحالي "يجمّع" النتائج من عدة Endpoints موجودة فعلًا كحل مؤقت،
 * لحد ما يتوفر Endpoint موحّد GET /notifications/pending-alerts من الباك.
 * الفحص يبدأ بعد 5 ثوانٍ من تحميل الصفحة كما هو مطلوب (مؤشر مرئي غير مزعج فور الدخول).
 */
export function useNotificationAlerts(branchId: string) {
  const [enabled, setEnabled] = useState(false);
  const { data: departments } = useDepartmentsDropdown(branchId);

  useEffect(() => {
    const timer = setTimeout(() => setEnabled(true), 5000);
    return () => clearTimeout(timer);
  }, [branchId]);

  return useQuery<NotificationAlertsDto>({
    queryKey: ['notification-alerts', branchId, departments?.map((d) => d.id)],
    enabled: enabled && !!branchId && !!departments,
    refetchInterval: 5 * 60 * 1000, // إعادة فحص كل 5 دقائق طالما الموقع مفتوح
    staleTime: 60_000,
    queryFn: async () => {
      if (!departments || departments.length === 0) return NO_ALERTS;

      const periods = [Period.AM, Period.PM];

      const birthdayChecks = await Promise.all(
        departments.flatMap((d) =>
          periods.map((p) => notificationService.checkBirthdays(branchId, d.id, p).catch(() => false))
        )
      );
      const unpaidChecks = await Promise.all(
        periods.map((p) => notificationService.hasUnpaidSubscriptions(branchId, p).catch(() => false))
      );

      return {
        hasBirthdayAlert: birthdayChecks.some(Boolean),
        hasUnpaidAlert: unpaidChecks.some(Boolean),
        hasBrotherAgeAlert: false,
        hasAbsenceAlert: false,
      };
    },
  });
}
