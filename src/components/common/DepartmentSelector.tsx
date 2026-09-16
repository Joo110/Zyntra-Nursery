import { Select } from '@/components/forms/Select';
import { useDepartmentsDropdown } from '@/modules/Departments/hooks/useDepartments';

interface DepartmentSelectorProps {
  branchId: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DepartmentSelector({ branchId, value, onChange, placeholder = 'اختر القسم' }: DepartmentSelectorProps) {
  const { data: departments, isLoading } = useDepartmentsDropdown(branchId);

  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={isLoading}>
      <option value="">{placeholder}</option>
      {departments?.map((d) => (
        <option key={d.id} value={d.id}>{d.departmentName}</option>
      ))}
    </Select>
  );
}
