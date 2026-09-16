import { Select } from '@/components/forms/Select';
import { useClassroomsList } from '@/modules/Classrooms/hooks/useClassrooms';

interface ClassSelectorProps {
  branchId: string;
  value: string;
  onChange: (value: string) => void;
}

const ALL_CLASSROOMS_TAKE = 100;

export function ClassSelector({ branchId, value, onChange }: ClassSelectorProps) {
  const { data, isLoading } = useClassroomsList(branchId, 1, ALL_CLASSROOMS_TAKE);
  const classrooms = data?.items ?? [];

  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} disabled={isLoading || !branchId}>
      <option value="">{isLoading ? 'جارِ التحميل...' : 'اختر الفصل'}</option>
      {classrooms.map((c) => (
        <option key={c.id} value={c.id}>
          {c.class ?? '—'}
        </option>
      ))}
    </Select>
  );
}