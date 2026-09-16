import { Select } from '@/components/forms/Select';
import { useBusesDropdown } from '@/modules/Buses/hooks/useBuses';

interface BusDropdownProps {
  branchId: string;
  value?: string | null;
  onChange: (value: string) => void;
}

/** دروب داون اختيار الباص — يُستخدم في فورم الطفل لربط الطفل بباص معيّن (Child.BusId) */
export function BusDropdown({ branchId, value, onChange }: BusDropdownProps) {
  const { data: buses, isLoading } = useBusesDropdown(branchId);

  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={isLoading}>
      <option value="">بدون باص</option>
      {buses?.map((b) => (
        <option key={b.id} value={b.id}>{b.name}</option>
      ))}
    </Select>
  );
}
