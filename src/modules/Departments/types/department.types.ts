export interface DepartmentListDto {
  id: string;
  departmentName: string;
  subscriptionPrice: number;
  studentCount: number;
  isActive: boolean;
  createdDate: string;
  worksSunday: boolean;
  worlsMonday: boolean;
  worksTuesday: boolean;
  worksWednesday: boolean;
  worksThursday: boolean;
  worksFriday: boolean;
  worksSaturday: boolean;
  isPrimaryDepartment: boolean;
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
  worksSunday: boolean;
  worlsMonday: boolean;
  worksTuesday: boolean;
  worksWednesday: boolean;
  worksThursday: boolean;
  worksFriday: boolean;
  worksSaturday: boolean;
  isPrimaryDepartment: boolean;
}

export interface AddDepartmentDto {
  departmentName: string;
  subscriptionPrice: number;
  worksSunday: boolean;
  worlsMonday: boolean;
  worksTuesday: boolean;
  worksWednesday: boolean;
  worksThursday: boolean;
  worksFriday: boolean;
  worksSaturday: boolean;
  isPrimaryDepartment: boolean;
}

export interface UpdateDepartmentDto {
  id: string;
  departmentName?: string | null;
  subscriptionPrice?: number | null;
  isActive?: boolean | null;
  worksSunday?: boolean | null;
  worlsMonday?: boolean | null;
  worksTuesday?: boolean | null;
  worksWednesday?: boolean | null;
  worksThursday?: boolean | null;
  worksFriday?: boolean | null;
  worksSaturday?: boolean | null;
  isPrimaryDepartment?: boolean | null;
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
