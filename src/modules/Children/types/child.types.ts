import type { Gender, Period } from '@/types/enums.types';

/** مطابق لـ ChildListDto */
export interface ChildListDto {
  id: string;
  name: string | null;
  city: string;
  address: string;
  dateOfBirth: string;
  level: string | null;
  class: string | null;
  period: Period;
  messageNumber: string;
  callPhoneNumber: string;
  gender: Gender;
}

export interface ChildDetailsDto {
  id: string;
  name: string | null;
  city: string;
  address: string;
  dateOfBirth: string;
  level: string | null;
  levelId: string;
  class: string | null;
  classId: string;
  period: Period;
  messageNumber: string;
  callPhoneNumber: string;
  gender: Gender;
  email: string | null;
  isActive: boolean;
  departmentIds: string[];
  /** ⚠️ يتطلب إضافة الحقلين في ChildDetailsDto بالـ Backend (راجع خطة الفرونت § 5) */
  busId?: string | null;
  isAdvancePaymentMade?: boolean;
  advancePaymentAmount?: number;
}

/** مطابق لـ ChildBirthDateNotificationDto */
export interface ChildBirthDateNotificationDto {
  id: string;
  name: string | null;
  dateOfBirth: string;
  messageNumber: string;
}

/** مطابق لـ ChildBasicInfoDto */
export interface ChildBasicInfoDto {
  id: string;
  name: string;
}

/**
 * مطابق تمامًا لـ AddChildDto — بما في ذلك الأخطاء الإملائية الأصلية بالـ Backend
 * (dateOfSubscraip, subscirptionAmount) والمحفوظة عمدًا هنا (راجع Master Prompt § 8 Types).
 */
export interface AddChildDto {
  name?: string | null;
  city: string;
  address: string;
  dateOfBirth: string;
  levelId: string;
  classId: string;
  dateOfSubscraip: string;
  departmentId: string[];
  gender: Gender;
  callPhoneNumber: string;
  period: Period;
  subscirptionAmount: number;
  howYouKnowNursery: number;
  socialStatus?: number | null;
  messageNumber: string;
  email?: string | null;
}

/** مطابق لـ UpdateChildDto */
export interface UpdateChildDto {
  id: string;
  name?: string | null;
  city?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  levelId?: string | null;
  classId?: string | null;
  departmentIds?: string[] | null;
  removedDepartmentIds?: string[] | null;
  gender?: Gender | null;
  callPhoneNumber: string;
  period?: Period | null;
  messageNumber?: string | null;
  email?: string | null;
  /** حقل موجود بالفعل في UpdateChildDto بالباك ولم يكن مستخدمًا بالفرونت */
  busId?: string | null;
}
