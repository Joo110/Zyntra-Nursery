export interface ChildAssessmentDto {
  id: string;
  childId: string;
  childName?: string | null;
  departmentId: string;
  departmentName?: string | null;
  currentLevel: string;
  progress?: string | null;
  workbook?: string | null;
  pageReached?: number | null;
  notes?: string | null;
  assessmentDate: string;
}

export interface AddChildAssessmentDto {
  childId: string;
  departmentId: string;
  currentLevel: string;
  progress?: string | null;
  workbook?: string | null;
  pageReached?: number | null;
  notes?: string | null;
  assessmentDate: string;
}

export interface UpdateChildAssessmentDto {
  id: string;
  currentLevel?: string | null;
  progress?: string | null;
  workbook?: string | null;
  pageReached?: number | null;
  notes?: string | null;
}

export interface ChildAssessmentHistoryDto {
  id: string;
  currentLevel: string;
  progress?: string | null;
  workbook?: string | null;
  pageReached?: number | null;
  assessmentDate: string;
  notes?: string | null;
}

export interface ChildDepartmentProgressDto {
  childId: string;
  childName?: string | null;
  departmentId: string;
  departmentName?: string | null;
  currentLevel?: string | null;
  currentProgress?: string | null;
  assessmentHistory: ChildAssessmentHistoryDto[];
}
