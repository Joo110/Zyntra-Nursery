import type { Gender } from '@/types/enums.types';

export interface GraduationDto {
  id: string;
  name: string;
  dateOfJoin: string;
  dateOfGraduation: string;
  imagePath?: string | null;
  gender: Gender;
}
export interface AddGraduationDto {
  name?: string | null;
  dateOfJoin: string;
  dateOfGraduation: string;
  imagePath?: string | null;
  gender: Gender;
}
export interface UpdateGraduationDto {
  id: string;
  name?: string | null;
  dateOfJoin?: string | null;
  dateOfGraduation?: string | null;
  imagePath?: string | null;
  gender?: Gender | null;
}
