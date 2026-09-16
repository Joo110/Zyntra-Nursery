/**
 * Query Key Factory مركزي — نمط هرمي موحّد لكل الـ Modules.
 * راجع 04-Architecture-CoreInfra-DesignSystem-SharedComponents.md § 5.2
 *
 * كل Module جديد يُضاف هنا بنفس النمط: all → lists → list(filters) → detail(id) ...
 * الهدف: Invalidation دقيق يستهدف الـ Keys ذات الصلة فقط (بدون invalidateQueries()
 * عام بلا Key، ممنوع حسب Master Prompt بند 46/10).
 */

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (pageNumber: number, take: number, searchName?: string) =>
    [...branchKeys.lists(), { pageNumber, take, searchName }] as const,
  dropdown: () => [...branchKeys.all, 'dropdown'] as const,
};

export const departmentKeys = {
  all: ['departments'] as const,
  lists: (branchId: string) => [...departmentKeys.all, 'list', branchId] as const,
  list: (branchId: string, pageNumber: number, take: number, searchName?: string) =>
    [...departmentKeys.lists(branchId), { pageNumber, take, searchName }] as const,
  dropdown: (branchId: string) => [...departmentKeys.all, 'dropdown', branchId] as const,
  detail: (departmentId: string) => [...departmentKeys.all, 'detail', departmentId] as const,
  financialStats: (branchId: string, departmentId: string) =>
    [...departmentKeys.all, 'financial-stats', branchId, departmentId] as const,
  attendanceStats: (branchId: string, departmentId: string, date: string) =>
    [...departmentKeys.all, 'attendance-stats', branchId, departmentId, date] as const,
};

export const classroomKeys = {
  all: ['classrooms'] as const,
  lists: (branchId: string) => [...classroomKeys.all, 'list', branchId] as const,
  list: (branchId: string, pageNumber: number, take: number) =>
    [...classroomKeys.lists(branchId), { pageNumber, take }] as const,
  count: (branchId: string) => [...classroomKeys.all, 'count', branchId] as const,
};

export const levelKeys = {
  all: ['levels'] as const,
  lists: (branchId: string) => [...levelKeys.all, 'list', branchId] as const,
  list: (branchId: string, pageNumber: number, take: number) =>
    [...levelKeys.lists(branchId), { pageNumber, take }] as const,
  count: (branchId: string) => [...levelKeys.all, 'count', branchId] as const,
};



export const childrenKeys = {
  all: ['children'] as const,
  lists: (branchId: string) => [...childrenKeys.all, 'list', branchId] as const,
  list: (
    branchId: string,
    departmentId: string,
    period: number,
    pageNumber: number,
    take: number,
    name?: string
  ) => [...childrenKeys.lists(branchId), { departmentId, period, pageNumber, take, name }] as const,
  detail: (branchId: string, id: string) => [...childrenKeys.all, 'detail', branchId, id] as const,
  archive: (
    branchId: string,
    departmentId: string,
    period: number,
    pageNumber: number,
    take: number,
    name?: string
  ) => [...childrenKeys.all, 'archive', branchId, { departmentId, period, pageNumber, take, name }] as const,
  birthdays: (branchId: string, departmentId: string, period: number, pageNumber: number, take: number) =>
    [...childrenKeys.all, 'birthdays', branchId, { departmentId, period, pageNumber, take }] as const,
  count: (branchId: string, period: number) => [...childrenKeys.all, 'count', branchId, period] as const,
  departmentChildren: (branchId: string, departmentId: string, period: number) =>
    [...childrenKeys.all, 'department-children', branchId, departmentId, period] as const,
};

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  active: () => [...userKeys.all, 'active'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  statistics: () => [...userKeys.all, 'statistics'] as const,
  countByRole: () => [...userKeys.all, 'count-by-role'] as const,
};
