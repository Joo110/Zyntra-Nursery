import type { Gender, MemberType, Period } from '@/types/enums.types';

export interface DepartueHistoryDto {
  id: string;
  date: string;
  time: string;
  memberType: MemberType;
  name: string;
  gender: Gender;
  class?: string | null;
  period: Period;
  department?: string | null;
}
