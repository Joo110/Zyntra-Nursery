import type { Gender, Period } from '@/types/enums.types';

export interface WorkerListDto {
  id: string;
  name: string;
  period: string;
  gender: Gender;
  genderName: string;
  phone: string;
}
export interface AddWorkerDto {
  name: string;
  phone: string;
  personalCardNumber?: string | null;
  gender: Gender;
  salary: number;
  period: Period;
}
export interface UpdateWorkerDto {
  id: string;
  name?: string | null;
  phone?: string | null;
  personalCardNumber?: string | null;
  gender?: Gender | null;
  salary?: number | null;
  period?: Period | null;
}


export interface WorkerDetailsDto {
  id: string;
  name: string;
  phone: string;
  personalCardNumber: string;
  gender: Gender;
  period: Period;
  salary: number;
}