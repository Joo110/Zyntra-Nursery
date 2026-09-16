import { cn } from '@/lib/cn';
import { Period, PeriodLabels } from '@/types/enums.types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (value: Period) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-md border border-neutral-300 bg-white p-0.5">
      {[Period.AM, Period.PM].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            value === p ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
          )}
        >
          {PeriodLabels[p]}
        </button>
      ))}
    </div>
  );
}
