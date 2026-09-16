import { axiosInstance } from '@/services/api/axiosInstance';
import type { MessageResponse } from '@/types/pagination.types';
import type {
  ChildAssessmentDto,
  AddChildAssessmentDto,
  UpdateChildAssessmentDto,
  ChildDepartmentProgressDto,
} from '../types/childAssessment.types';

/** راجع ChildAssessmentController بالباك (Route: api/branches/{branchId}/children/assessments) */

// 404 من الـ endpoints دي معناه "مفيش تقييمات مسجلة لسه" وده حالة طبيعية
// مش error حقيقي، فبنمسكه هنا ونرجّع قيمة فاضية بدل ما نسيبه يطلع كـ exception
function isNotFound(err: unknown): boolean {
  return (err as { status?: number })?.status === 404;
}

export const childAssessmentService = {
  add: (branchId: string, dto: AddChildAssessmentDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/children/assessments`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateChildAssessmentDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/children/assessments`, dto).then((res) => res.data),

  remove: (branchId: string, assessmentId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/children/assessments/${assessmentId}`).then((res) => res.data),

  getById: (branchId: string, assessmentId: string) =>
    axiosInstance
      .get<ChildAssessmentDto>(`/branches/${branchId}/children/assessments/${assessmentId}`)
      .then((res) => res.data),

  getLatest: (branchId: string, childId: string, departmentId: string) =>
    axiosInstance
      .get<ChildAssessmentDto>(`/branches/${branchId}/children/assessments/children/${childId}/departments/${departmentId}/latest`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return null;
        throw err;
      }),

  getHistory: (branchId: string, childId: string, departmentId: string) =>
    axiosInstance
      .get<ChildAssessmentDto[]>(`/branches/${branchId}/children/assessments/children/${childId}/departments/${departmentId}/history`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return [];
        throw err;
      }),

  getProgress: (branchId: string, childId: string, departmentId: string) =>
    axiosInstance
      .get<ChildDepartmentProgressDto>(`/branches/${branchId}/children/assessments/children/${childId}/departments/${departmentId}/progress`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return null;
        throw err;
      }),

  getAllForChild: (branchId: string, childId: string) =>
    axiosInstance
      .get<ChildAssessmentDto[]>(`/branches/${branchId}/children/assessments/children/${childId}/all`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return [];
        throw err;
      }),

  getAllForDepartment: (branchId: string, departmentId: string) =>
    axiosInstance
      .get<ChildAssessmentDto[]>(`/branches/${branchId}/children/assessments/departments/${departmentId}/all`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return [];
        throw err;
      }),

  hasAssessment: (branchId: string, childId: string, departmentId: string) =>
    axiosInstance
      .get<boolean>(`/branches/${branchId}/children/assessments/children/${childId}/departments/${departmentId}/exists`)
      .then((res) => res.data),

  getCompleteProgress: (branchId: string, childId: string) =>
    axiosInstance
      .get<ChildDepartmentProgressDto[]>(`/branches/${branchId}/children/assessments/children/${childId}/complete-progress`)
      .then((res) => res.data)
      .catch((err) => {
        if (isNotFound(err)) return [];
        throw err;
      }),
};