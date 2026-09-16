import type { MemberType } from '@/types/enums.types';

/** مطابق لـ SalariesService.EmployeeSalaryDto */
export interface EmployeeSalaryDto {
  id: string;
  employeeId: string;
  employeeName: string | null;
  amount: number;
  salaryMonth: string;
}

/** مطابق لـ SalaryReceiptDto */
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

/**
 * مطابق لـ EmployeeSalary Entity — الباك بياخد الـ Entity مباشرة في POST/PUT
 * (راجع SalariesController.AddSalaryAsync/UpdateSalaryAsync) بدل DTO منفصل.
 */
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