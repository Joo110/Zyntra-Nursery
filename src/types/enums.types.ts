
export const Period = {
  AM: 0,
  PM: 1,
} as const;
export type Period = (typeof Period)[keyof typeof Period];

export const Gender = {
  male: 0,
  female: 1,
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const MemberType = {
  Child: 'C',
  Teacher: 'T',
  Worker: 'W',
} as const;
export type MemberType = (typeof MemberType)[keyof typeof MemberType];

export const UserRole = {
  Admin: 0,
  Manager: 1,
  Specialist: 2,
  Teacher: 3,
  Staff: 4,
  Accountant: 5,
  Driver: 6,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const TrunsactionType = {
  Income: 0,
  Expenses: 1,
} as const;
export type TrunsactionType = (typeof TrunsactionType)[keyof typeof TrunsactionType];

export const TreasuryKind = {
  SubscriptionPayment: 'K',
  TeacherSalary: 'T',
  RemainingSubscriptionPayment: 'B',
  WorkerSalary: 'W',
  AdditionalRevenue: 'I',
  AdditionalExpenses: 'E',
} as const;
export type TreasuryKind = (typeof TreasuryKind)[keyof typeof TreasuryKind];

export const SentVia = {
  WhatsApp: 0,
  Email: 1,
  SMS: 2,
} as const;
export type SentVia = (typeof SentVia)[keyof typeof SentVia];

export const PeriodLabels: Record<Period, string> = {
  [Period.AM]: 'صباحي',
  [Period.PM]: 'مسائي',
};

export const GenderLabels: Record<Gender, string> = {
  [Gender.male]: 'ذكر',
  [Gender.female]: 'أنثى',
};

export const MemberTypeLabels: Record<MemberType, string> = {
  [MemberType.Child]: 'طفل',
  [MemberType.Teacher]: 'معلم',
  [MemberType.Worker]: 'عامل',
};

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: 'مدير النظام',
  [UserRole.Manager]: 'مدير',
  [UserRole.Specialist]: 'أخصائي',
  [UserRole.Teacher]: 'معلم',
  [UserRole.Staff]: 'موظف',
  [UserRole.Accountant]: 'محاسب',
  [UserRole.Driver]: 'سائق',
};

export const TrunsactionTypeLabels: Record<TrunsactionType, string> = {
  [TrunsactionType.Income]: 'دخل',
  [TrunsactionType.Expenses]: 'مصروفات',
};

export const SentViaLabels: Record<SentVia, string> = {
  [SentVia.WhatsApp]: 'واتساب',
  [SentVia.Email]: 'بريد إلكتروني',
  [SentVia.SMS]: 'رسالة نصية',
};
