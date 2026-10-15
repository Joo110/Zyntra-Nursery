import type { Gender, Period } from '@/types/enums.types';

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
  busId?: string | null;
  isAdvancePaymentMade?: boolean;
  advancePaymentAmount?: number;
}

export interface ChildBirthDateNotificationDto {
  id: string;
  name: string | null;
  dateOfBirth: string;
  messageNumber: string;
}

export interface ChildBasicInfoDto {
  id: string;
  name: string;
}

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
  howYouKnowNursery: number;
  socialStatus?: number | null;
  messageNumber: string;
  email?: string | null;
}

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
  busId?: string | null;
}