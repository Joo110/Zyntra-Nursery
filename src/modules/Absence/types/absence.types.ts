import type { MemberType, Period } from '@/types/enums.types';

export interface AbsenceHistoryDto {
  id: string;
  memberId: string;
  memberName: string;
  gender?: string | null;
  date: string;
  className?: string | null;
  period: Period;
  memberType: MemberType;
  month: string;
  departmentName?: string | null;
}
export interface AddAbsenceHistoryDto {
  memberId: string;
  date: string;
  month?: string | null;
  memberType: MemberType;
}
