export interface DepartmentListDto {
  id: string;
  departmentName: string;
  subscriptionPrice: number;
  studentCount: number;
  isActive: boolean;
  createdDate: string;
}

export interface DepartmentDropdownDto {
  id: string;
  departmentName: string;
}

export interface DepartmentDetailDto {
  id: string;
  departmentName: string;
  subscriptionPrice: number;
  studentCount: number;
  activeStudentCount: number;
  isActive: boolean;
  createdDate: string;
}

export interface AddDepartmentDto {
  departmentName: string;
  subscriptionPrice: number;
}

export interface UpdateDepartmentDto {
  id: string;
  departmentName?: string | null;
  subscriptionPrice?: number | null;
  isActive?: boolean | null;
}

export interface DepartmentFinancialStatsDto {
  departmentId: string;
  departmentName: string;
  subscriptionPrice: number;
  totalStudents: number;
  activeStudents: number;
  totalPaid: number;
  totalOutstanding: number;
  expectedTotal: number;
}
