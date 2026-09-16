/** مطابق للـ Entity اللي بيرجع من GET /Setting بالكامل */
export interface SettingDto {
  id: string;

  // مواعيد حضور/انصراف الأطفال (صباحي/مسائي)
  timeEnter: string;
  timeEnterPm: string;
  lasttimeEnter: string;
  lasttimeEnterPm: string;
  timeLeave: string;
  timeLeavePm: string;
  lasttimeLeave: string;
  lasttimeLeavePm: string;
  timeLateForKids: string;
  timeLateForKidsPm: string;

  // مواعيد المعلمين
  timeEnterForTeacher: string;
  timeEnterForTeacherPm: string;
  timeLateForTeachers: string;
  timeLateForTeachersPm: string;

  // مواعيد العمال
  timeEnterForWorker: string;
  timeEnterForWorkerPm: string;
  timeLateForWorkers: string;
  timeLateForWorkersPm: string;

  // قواعد مالية / حضور
  daysLateToPay: number;
  daysKindsAbsence: number;
  kidsBratherAge: number;
  kidsBratherAge2?: string | null;
  notefayKidsLate: number;
  lateDiscount: number;
  absenceLate: number;
  dayOfStaudyInMonth: number;
  vication1: number;
  vication2: number;
  isPayInBegning: boolean;
  teacherSalary: number;
  workerSalary: number;
  childSubscriptionAmount: number;

  // بيانات المنشأة
  orgName?: string | null;
  managerName?: string | null;
  logoPath?: string | null;
  packupPath?: string | null;
  orgEmail?: string | null;

  // إعدادات الطباعة
  smallPaper: boolean;
  askBeforPrint: boolean;
  showBeforPrint: boolean;

  // تكامل الرسائل (SMS/WhatsApp)
  smsNumber?: string | null;
  smsNumberAPIKey?: string | null;
  whatsAppNumber?: string | null;
  whatsAppNumberAPIKey?: string | null;

  // نماذج الرسائل النصية
  subMessage?: string | null;
  absenceMessage?: string | null;
  brothersAgeMessage?: string | null;
  birthDayMessage?: string | null;
  empAge?: string | null;

  mode: boolean;
}

/** مطابق لـ UpdateSettingDto — تحديث جزئي (Only provided fields will be updated) */
export interface UpdateSettingDto {
  id: string;

  timeEnter?: string | null;
  timeEnterPm?: string | null;
  lasttimeEnter?: string | null;
  lasttimeEnterPm?: string | null;
  timeLeave?: string | null;
  timeLeavePm?: string | null;
  lasttimeLeave?: string | null;
  lasttimeLeavePm?: string | null;
  timeLateForKids?: string | null;
  timeLateForKidsPm?: string | null;

  timeEnterForTeacher?: string | null;
  timeEnterForTeacherPm?: string | null;
  timeLateForTeachers?: string | null;
  timeLateForTeachersPm?: string | null;

  timeEnterForWorker?: string | null;
  timeEnterForWorkerPm?: string | null;
  timeLateForWorkers?: string | null;
  timeLateForWorkersPm?: string | null;

  daysLateToPay?: number | null;
  daysKindsAbsence?: number | null;
  kidsBratherAge?: number | null;
  kidsBratherAge2?: string | null;
  notefayKidsLate?: number | null;
  lateDiscount?: number | null;
  absenceLate?: number | null;
  dayOfStaudyInMonth?: number | null;
  vication1?: number | null;
  vication2?: number | null;
  isPayInBegning?: boolean | null;
  teacherSalary?: number | null;
  workerSalary?: number | null;
  childSubscriptionAmount?: number | null;

  orgName?: string | null;
  managerName?: string | null;
  logoPath?: string | null;
  packupPath?: string | null;
  orgEmail?: string | null;

  smallPaper?: boolean | null;
  askBeforPrint?: boolean | null;
  showBeforPrint?: boolean | null;

  smsNumber?: string | null;
  smsNumberAPIKey?: string | null;
  whatsAppNumber?: string | null;
  whatsAppNumberAPIKey?: string | null;

  subMessage?: string | null;
  absenceMessage?: string | null;
  brothersAgeMessage?: string | null;
  birthDayMessage?: string | null;
  empAge?: string | null;
}

export interface BackupDatabaseParams {
  backupName?: string;
}

export interface RestoreDatabaseParams {
  fileName: string;
}