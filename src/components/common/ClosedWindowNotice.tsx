import { Lock } from 'lucide-react';
import type { WindowSlot } from '@/modules/Settings/hooks/useScheduleRules';

interface ClosedWindowNoticeProps {
  title: string;
  actionLabel: string;
  slots: WindowSlot[];
}

export function ClosedWindowNotice({ title, actionLabel, slots }: ClosedWindowNoticeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-surface p-14 text-center">
        <Lock className="h-8 w-8 text-neutral-300" />
        <p className="text-sm font-medium text-neutral-700">هذه الشاشة مغلقة حاليًا خارج مواعيد {actionLabel}</p>
        <div className="flex flex-col gap-1 text-xs text-neutral-500">
          {slots.map((s) => (
            <p key={s.period} className="ltr-numerals">
              {actionLabel} {s.label}: من {s.startLabel} إلى {s.endLabel}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
