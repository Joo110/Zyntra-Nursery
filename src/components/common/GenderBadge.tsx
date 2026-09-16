import { cn } from '@/lib/cn';
import { Gender, GenderLabels } from '@/types/enums.types';

export function GenderBadge({ gender }: { gender: Gender }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        gender === Gender.male ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary'
      )}
    >
      {GenderLabels[gender]}
    </span>
  );
}
