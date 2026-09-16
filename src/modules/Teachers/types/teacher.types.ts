import type { Gender, Period } from '@/types/enums.types';

export interface TeacherListDto {
  id: string;
  name: string;
  address: string;
  qualification: string;
  dateOfBirth: string;
  levelName?: string | null;
  className?: string | null;
  period: string;
  gender: Gender;
  genderName: string;
  phoneNumber: string;
}

export interface TeacherDetailsDto {
  id: string;
  name: string;
  address: string;
  qualification: string;
  school: string;
  personalCardNumber: string;
  email: string | null;
  phoneNumber: string;
  dateOfBirth: string;
  imagePath: string | null;
  levelId: string;
  levelName: string | null;
  classId: string;
  className: string | null;
  gender: Gender;
  period: Period;
  salary: number;
}

export interface AddTeacherDto {
  name: string;
  qualification: string;
  school: string;
  personalCardNumber?: string | null;
  email?: string | null;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  imagePath?: string | null;
  levelId: string;
  classId: string;
  gender: Gender;
  period: Period;
  salary: number;
}

export interface UpdateTeacherDto {
  id: string;
  name?: string | null;
  qualification?: string | null;
  school?: string | null;
  personalCardNumber?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  imagePath?: string | null;
  levelId?: string | null;
  classId?: string | null;
  gender?: Gender | null;
  period?: Period | null;
  salary?: number | null;
}
