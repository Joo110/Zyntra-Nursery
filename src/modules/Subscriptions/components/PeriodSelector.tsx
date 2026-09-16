import { Period } from '@/types/enums.types';

interface Props {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIOD_LABELS: Record<Period, string> = {
  [Period.AM]: 'صباحي',
  [Period.PM]: 'مسائي',
};

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as Period)}
      className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none"
    >
      {Object.values(Period)
        .filter((v): v is Period => typeof v === 'number')
        .map((p) => (
          <option key={p} value={p}>
            {PERIOD_LABELS[p]}
          </option>
        ))}
    </select>
  );
}