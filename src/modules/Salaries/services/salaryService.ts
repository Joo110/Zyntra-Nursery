import { axiosInstance } from '@/services/api/axiosInstance';
import type { MessageResponse } from '@/types/pagination.types';
import { MemberTypeBodyValue, MemberTypeQueryName, type MemberType } from '../../Salaries/types/enums.types';
import type { EmployeeSalaryDto, SalaryReceiptDto, AddSalaryDto, UpdateSalaryDto } from '../types/salary.types';
import type { EmployeeBaseSalaryDto } from '../types/salary.types';


export const salaryService = {
  getReceipt: (branchId: string, salaryId: string) =>
    axiosInstance
      .get<SalaryReceiptDto>(`/branches/${branchId}/Salaries/receipt/${salaryId}`)
      .then((res) => res.data),

  getReceiptsByDateRange: (branchId: string, dateFrom: string, dateTo: string, type?: MemberType) =>
    axiosInstance
      .get<SalaryReceiptDto[]>(`/branches/${branchId}/Salaries/receipts`, {
        params: { dateFrom, dateTo, type: type ? MemberTypeQueryName[type] : undefined },
      })
      .then((res) => res.data),

  getList: (branchId: string, type: MemberType) =>
    axiosInstance
      .get<EmployeeSalaryDto[]>(`/branches/${branchId}/Salaries/list`, {
        params: { type: MemberTypeQueryName[type] },
      })
      .then((res) => res.data),

        getBaseSalary: (branchId: string, type: MemberType, employeeId: string) =>
    axiosInstance
      .get<EmployeeBaseSalaryDto>(`/branches/${branchId}/Salaries/base-salary`, {
        params: { type: MemberTypeQueryName[type], employeeId },
      })
      .then((res) => res.data),

  getListByDateRange: (branchId: string, type: MemberType, dateFrom: string, dateTo: string) =>
    axiosInstance
      .get<EmployeeSalaryDto[]>(`/branches/${branchId}/Salaries/list/date-range`, {
        params: { type: MemberTypeQueryName[type], dateFrom, dateTo },
      })
      .then((res) => res.data),

  add: (branchId: string, dto: AddSalaryDto) =>
    axiosInstance
      .post<MessageResponse>(`/branches/${branchId}/Salaries`, {
        ...dto,
        employeeType: MemberTypeBodyValue[dto.employeeType],
      })
      .then((res) => res.data),

  update: (branchId: string, dto: UpdateSalaryDto) =>
    axiosInstance
      .put<MessageResponse>(`/branches/${branchId}/Salaries`, {
        ...dto,
        employeeType: MemberTypeBodyValue[dto.employeeType],
      })
      .then((res) => res.data),

  remove: (branchId: string, salaryId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Salaries/${salaryId}`).then((res) => res.data),
};