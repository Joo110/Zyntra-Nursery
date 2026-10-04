import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Cake, CircleDollarSign, Users2, UserX } from 'lucide-react';
import { useNotificationAlerts } from '../hooks/useNotificationAlerts';
import { useBranchStore } from '@/app/providers/branchStore';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/app/router/routes.constants'; // ⚠️ عدّل المسار حسب مكان الملف عندك

/**
 * جرس الإشعارات + النقطة الحمراء — راجع خطة الفرونت § مؤشر التنبيهات المرئي.
 * يفحص الحالات الأربعة (أعياد ميلاد / عدم دفع / سن الأخ / تجاوز غياب) بعد 5 ثوانٍ من فتح الموقع.
 * الضغط على أي تنبيه نشط يفتح الشاشة الخاصة به.
 */
export function NotificationBell() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const { data: alerts } = useNotificationAlerts(branchId ?? '');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hasAnyAlert = !!alerts && (alerts.hasBirthdayAlert || alerts.hasUnpaidAlert || alerts.hasBrotherAgeAlert || alerts.hasAbsenceAlert);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!branchId) return null;

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
        aria-label="الإشعارات"
      >
        <Bell className="h-5 w-5" />
        {hasAnyAlert && (
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" aria-label="يوجد تنبيهات معلّقة" />
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-neutral-200 bg-surface shadow-lg">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">التنبيهات</p>
          </div>
          <div className="flex flex-col divide-y divide-neutral-100">
            <AlertRow
              icon={Cake}
              label="أعياد ميلاد اليوم"
              active={!!alerts?.hasBirthdayAlert}
              onClick={() => go(ROUTES.CHILDREN_BIRTHDAYS)}
            />
            <AlertRow
              icon={CircleDollarSign}
              label="اشتراكات غير مدفوعة"
              active={!!alerts?.hasUnpaidAlert}
              onClick={() => go(ROUTES.SUBSCRIPTIONS)}
            />
            <AlertRow
              icon={Users2}
              label="اقتراب سن الأخ"
              active={!!alerts?.hasBrotherAgeAlert}
              disabledNote="غير متاح بعد (بانتظار الباك)"
              onClick={() => go(ROUTES.BROTHERS)}
            />
            <AlertRow
              icon={UserX}
              label="تجاوز حد الغياب"
              active={!!alerts?.hasAbsenceAlert}
              disabledNote="غير متاح بعد (بانتظار الباك)"
              onClick={() => go(ROUTES.ABSENCE)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AlertRow({
  icon: Icon,
  label,
  active,
  disabledNote,
  onClick,
}: {
  icon: typeof Bell;
  label: string;
  active: boolean;
  disabledNote?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!active}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm',
        active ? 'cursor-pointer hover:bg-neutral-50' : 'cursor-default'
      )}
    >
      <Icon className={cn('h-4 w-4', active ? 'text-danger' : 'text-neutral-300')} />
      <div className="flex-1">
        <p className={cn(active ? 'text-neutral-900' : 'text-neutral-400')}>{label}</p>
        {disabledNote && <p className="text-xs text-neutral-300">{disabledNote}</p>}
      </div>
      {active && <span className="h-2 w-2 rounded-full bg-danger" />}
    </button>
  );
}