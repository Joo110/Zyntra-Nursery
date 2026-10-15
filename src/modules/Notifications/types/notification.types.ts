export interface NotificationAlertsDto {
  hasBirthdayAlert: boolean;
  hasUnpaidAlert: boolean;
  hasBrotherAgeAlert: boolean;
  hasAbsenceAlert: boolean;
}

export const NO_ALERTS: NotificationAlertsDto = {
  hasBirthdayAlert: false,
  hasUnpaidAlert: false,
  hasBrotherAgeAlert: false,
  hasAbsenceAlert: false,
};
