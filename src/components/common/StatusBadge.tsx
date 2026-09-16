import { cn } from '@/lib/cn';

type StatusKind = 'active' | 'inactive' | 'paid' | 'unpaid';

interface StatusBadgeProps {
  status: StatusKind;
}

const config: Record<StatusKind, { label: string; className: string }> = {
  active: { label: 'نشط', className: 'bg-secondary/10 text-secondary' },
  inactive: { label: 'غير نشط', className: 'bg-neutral-200 text-neutral-600' },
  paid: { label: 'مدفوع', className: 'bg-secondary/10 text-secondary' },
  unpaid: { label: 'غير مدفوع', className: 'bg-warning/20 text-neutral-800' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', className)}>
      {label}
    </span>
  );
}
