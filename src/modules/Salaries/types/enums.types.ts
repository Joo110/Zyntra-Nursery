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

/**
 * ⚠️ مهم جدًا: enum الـ MemberType في الباك اند معرّف كـ Child='C', Teacher='T', Worker='W'
 * لكن الحروف دي بتتحول لأكواد ASCII وقت الـ compile (C#)، يعني القيمة الفعلية للـ enum
 * هي رقم (67/84/87) مش الحرف نفسه.
 *
 * الـ Model Binding بتاع [FromQuery] في ASP.NET Core (query string فقط، مش JSON body)
 * بيتجاهل أي JSON Converter مخصص، وبيقبل بس: اسم العضو الحقيقي ("Teacher"/"Worker"/"Child")
 * أو الرقم (84/87/67) — مش الحرف "T"/"W"/"C".
 *
 * لذلك أي endpoint بياخد MemberType كـ query parameter (Attendance/history, Salaries/list,
 * Salaries/list/date-range, Salaries/receipts...) لازم يتبعتله اسم العضو الكامل، مش الحرف.
 * استخدم الـ mapping ده بس عند بناء query params — الحرف يفضل مستخدم عادي في أي مكان تاني
 * (Body requests، مقارنات، الخ).
 */
export const MemberTypeQueryName: Record<MemberType, string> = {
  [MemberType.Child]: 'Child',
  [MemberType.Teacher]: 'Teacher',
  [MemberType.Worker]: 'Worker',
};

/**
 * ⚠️ مختلف عن MemberTypeQueryName: ده للـ JSON Body بس.
 *
 * الـ Query String Model Binding بتاع ASP.NET Core بيقبل اسم العضو ("Teacher") أو رقمه.
 * لكن الـ JSON Body بيتحول بواسطة System.Text.Json، واللي من غير JsonStringEnumConverter
 * مسجل صراحة في الباك اند، بيرفض تمامًا أي نص للـ enum ومحتاج الرقم مباشرة.
 *
 * والرقم هنا هو كود الـ ASCII بتاع الحرف نفسه، لأن enum المعرف بـ Child='C', Teacher='T',
 * Worker='W' بيتحول تلقائيًا لأرقام وقت الـ compile في C# (char → int implicit conversion):
 * Child = 67, Teacher = 84, Worker = 87.
 *
 * استخدم الـ mapping ده عند بناء أي request body (POST/PUT) فيه حقل MemberType
 * (Salaries.add/update, Treasury.add/update, Absence.add, MessageArchive.add، إلخ).
 */
export const MemberTypeBodyValue: Record<MemberType, number> = {
  [MemberType.Child]: 67,
  [MemberType.Teacher]: 84,
  [MemberType.Worker]: 87,
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