import type { MemberType } from '@/types/enums.types';

export interface EmployeeSalaryDto {
  id: string;
  employeeId: string;
  employeeName: string | null;
  amount: number;
  salaryMonth: string;
  isPaid: boolean;
}

export interface SalaryReceiptDto {
  salaryId: string;
  employeeId: string;
  employeeName: string;
  employeeType: string;
  amount: number;
  salaryMonth: string;
  isPaid: boolean;
  generatedDate: string;
}

export interface EmployeeBaseSalaryDto {
  employeeId: string;
  employeeName: string;
  amount: number;
}

export interface AddSalaryDto {
  employeeId: string;
  branchId: string;
  employeeType: MemberType;
  amount: number;
  salaryMonth: string;
  isPaid: boolean;
}

export interface UpdateSalaryDto extends AddSalaryDto {
  id: string;
}