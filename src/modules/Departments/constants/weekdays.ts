export type WeekdayKey =
  | 'worksSaturday'
  | 'worksSunday'
  | 'worlsMonday'
  | 'worksTuesday'
  | 'worksWednesday'
  | 'worksThursday'
  | 'worksFriday';

export const WEEKDAYS: { key: WeekdayKey; label: string }[] = [
  { key: 'worksSaturday', label: 'السبت' },
  { key: 'worksSunday', label: 'الأحد' },
  { key: 'worlsMonday', label: 'الاثنين' },
  { key: 'worksTuesday', label: 'الثلاثاء' },
  { key: 'worksWednesday', label: 'الأربعاء' },
  { key: 'worksThursday', label: 'الخميس' },
  { key: 'worksFriday', label: 'الجمعة' },
];
