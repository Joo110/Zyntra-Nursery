import { Select } from '@/components/forms/Select';
import { useDepartmentsDropdown, useTodayDepartmentsDropdown } from '@/modules/Departments/hooks/useDepartments';

interface DepartmentSelectorProps {
  branchId: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  workingTodayOnly?: boolean;
}

export function DepartmentSelector({
  branchId,
  value,
  onChange,
  placeholder = 'اختر القسم',
  workingTodayOnly = false,
}: DepartmentSelectorProps) {
  const all = useDepartmentsDropdown(workingTodayOnly ? '' : branchId);
  const today = useTodayDepartmentsDropdown(branchId, workingTodayOnly);
  const { data: departments, isLoading } = workingTodayOnly ? today : all;

  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={isLoading}>
      <option value="">{workingTodayOnly && !isLoading && departments?.length === 0 ? 'لا توجد أقسام تعمل اليوم' : placeholder}</option>
      {departments?.map((d) => (
        <option key={d.id} value={d.id}>{d.departmentName}</option>
      ))}
    </Select>
  );
}
