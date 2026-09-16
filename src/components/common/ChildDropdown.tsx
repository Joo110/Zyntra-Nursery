import { Select } from '@/components/forms/Select';
import { useDepartmentChildren } from '@/modules/Children/hooks/useChildren';
import type { Period } from '@/types/enums.types';

interface ChildDropdownProps {
  branchId: string;
  departmentId?: string;
  period: Period;
  value?: string;
  onChange: (value: string) => void;
}

export function ChildDropdown({ branchId, departmentId, period, value, onChange }: ChildDropdownProps) {
  const { data: children, isLoading } = useDepartmentChildren(branchId, departmentId ?? '', period);

  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={!departmentId || isLoading}>
      <option value="">{!departmentId ? 'اختر القسم أولًا' : 'اختر الطالب'}</option>
      {children?.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </Select>
  );
}
