import { cn } from '@/lib/cn';
import { MemberType, MemberTypeLabels } from '@/types/enums.types';

interface MemberTypeSelectorProps {
  value: MemberType;
  onChange: (value: MemberType) => void;
}


export function MemberTypeSelector({ value, onChange }: MemberTypeSelectorProps) {
  return (
    <div className="inline-flex rounded-md border border-neutral-300 bg-white p-0.5">
      {[MemberType.Child, MemberType.Teacher, MemberType.Worker].map((mt) => (
        <button
          key={mt}
          type="button"
          onClick={() => onChange(mt)}
          className={cn(
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            value === mt ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
          )}
        >
          {MemberTypeLabels[mt]}
        </button>
      ))}
    </div>
  );
}
