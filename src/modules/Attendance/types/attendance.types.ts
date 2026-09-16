import type { Gender, MemberType, Period } from '@/types/enums.types';

export interface AttendanceHistoryDto {
  id: string;
  late: number;
  date: string;
  time: string;
  memberType: MemberType;
  name: string;
  gender: Gender;
  class?: string | null;
  period: Period;
  department?: string | null;
}
export interface AddAttendanceHistoryDto {
  memberId: string;
  date: string;
  time: string;
  late: number;
  memberType: MemberType;
}
