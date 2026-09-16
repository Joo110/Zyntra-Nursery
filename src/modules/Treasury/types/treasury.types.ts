import type { MemberType, TrunsactionType } from '@/types/enums.types';

export interface TreasuryDataDto {
  amount: number;
  dateTime: string;
  month?: string | null;
  kind: string;
  transaction: string;
  userName: string;
}
export interface AddTreasuryDataDto {
  amount: number;
  dateTime: string;
  memberType: MemberType;
  trunsactionType: TrunsactionType;
  userId: string;
  memberId: string;
  month?: string | null;
}

/** مطابق لـ UpdateTreasuryDataDto — كل الحقول اختيارية (Partial Update) */
export interface UpdateTreasuryDataDto {
  id: string;
  amount?: number | null;
  dateTime?: string | null;
  memberType?: MemberType | null;
  trunsactionType?: TrunsactionType | null;
  userId?: string | null;
  memberId?: string | null;
  month?: string | null;
}

/** مطابق لـ OverduePaymentDetailDto */
export interface OverduePaymentDetailDto {
  originalMonth: string;
  amount: number;
  childName: string;
  className: string;
  departmentName: string;
}

/** مطابق لـ DepartmentMonthlyDetailDto */
export interface DepartmentMonthlyDetailDto {
  departmentName: string;
  departmentIncome: number;
  paidChildrenCount: number;
  departmentCollectionPercentage: number;
}

/** مطابق لـ MonthlyTreasuryReportDto */
export interface MonthlyTreasuryReportDto {
  monthDate: string;
  totalIncome: number;
  totalSalariesPaid: number;
  totalAdditionalExpenses: number;
  profit: number;
  totalWithdrawals: number;
  remainingBalance: number;
  overdueAmounts: number;
  currentMonthBalance: number;
  collectionRatePercentage: number;
  overduePaymentDetails: OverduePaymentDetailDto[];
  departmentDetails: DepartmentMonthlyDetailDto[];
}

/** مطابق لـ DepartmentTreasuryReportDto */
export interface DepartmentTreasuryReportDto {
  departmentName: string;
  activeChildrenCount: number;
  subscriptionPrice: number;
  expectedTotal: number;
  totalCollected: number;
  totalPaid: number;
  paidChildrenCount: number;
  unpaidChildrenCount: number;
  collectionPercentage: number;
  reportStartDate?: string | null;
  reportEndDate?: string | null;
}
