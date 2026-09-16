/**
 * ⚠️ لا يوجد Endpoint موحّد بالباك يرجّع الحالات الأربعة مع بعض (راجع خطة الفرونت § الإشعارات).
 * هذا الـ Type تمثيل للحل المؤقت في الفرونت لحد ما الباك يضيف:
 * GET /branches/{branchId}/notifications/pending-alerts
 */
export interface NotificationAlertsDto {
  hasBirthdayAlert: boolean;
  hasUnpaidAlert: boolean;
  /** ⚠️ Gap حقيقي بالباك — لا يوجد Endpoint لفحص سن الأخ حاليًا، القيمة دائمًا false مؤقتًا */
  hasBrotherAgeAlert: boolean;
  /** ⚠️ Gap حقيقي بالباك — لا يوجد Endpoint لفحص تجاوز حد الغياب حاليًا، القيمة دائمًا false مؤقتًا */
  hasAbsenceAlert: boolean;
}

export const NO_ALERTS: NotificationAlertsDto = {
  hasBirthdayAlert: false,
  hasUnpaidAlert: false,
  hasBrotherAgeAlert: false,
  hasAbsenceAlert: false,
};
