import type { Gender } from '@/types/enums.types';

export interface EvaluationInfoDto {
  id: string; 
  childId: string;
  childName: string;
  gender: Gender;
  classId: string;
  degree1: boolean;
  degree2: boolean;
  degree3: boolean;
  degree4: boolean;
  degree5: boolean;
  degree6: boolean;
  degree7: boolean;
  totalDegrees: number;
}

export interface EvaluationAverageDto {
  degree: number;
  period: number;
  className: string;
}

export interface WinnerHistoryDto {
  childName: string;
  date: string;
  degree: number;
}

export interface WinnerCardDto {
  childName: string;
  className: string;
  gender: Gender;
  degree: number;
  date: string;
}

export interface UpdateDayEvaluationDto {
  id: string;
  childId?: string;
  degree1?: boolean;
  degree2?: boolean;
  degree3?: boolean;
  degree4?: boolean;
  degree5?: boolean;
  degree6?: boolean;
  degree7?: boolean;
  totalDegrees?: number;
}

export const DEGREE_KEYS = ['degree1', 'degree2', 'degree3', 'degree4', 'degree5', 'degree6', 'degree7'] as const;
export type DegreeKey = (typeof DEGREE_KEYS)[number];