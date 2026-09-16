import { Modal } from '@/components/modals/Modal';
import { GenderBadge } from '@/components/common/GenderBadge';
import { useChild } from '../hooks/useChildren';
import { PageLoader } from '@/components/loading/PageLoader';
import { PeriodLabels } from '@/types/enums.types';

interface Props {
  branchId: string;
  childId: string | null;
  onClose: () => void;
}

export function ChildDetailsModal({ branchId, childId, onClose }: Props) {
  const { data: child, isLoading } = useChild(branchId, childId ?? undefined);

  return (
    <Modal isOpen={!!childId} onClose={onClose} title="بيانات الطالب">
      {isLoading || !child ? (
        <PageLoader label="جاري تحميل بيانات الطالب..." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: 'الاسم', value: child.name || '—' },
            { label: 'النوع', value: <GenderBadge gender={child.gender} /> },
            { label: 'المستوى', value: child.level || '—' },
            { label: 'الفصل', value: child.class || '—' },
            { label: 'رقم التواصل', value: <span className="ltr-numerals">{child.callPhoneNumber || '—'}</span> },
            { label: 'رقم الرسائل', value: <span className="ltr-numerals">{child.messageNumber || '—'}</span> },
            { label: 'تاريخ الميلاد', value: <span className="ltr-numerals">{child.dateOfBirth?.slice(0, 10)}</span> },
            { label: 'العنوان', value: child.address || '—' },
            { label: 'المدينة', value: child.city || '—' },
            { label: 'البريد الإلكتروني', value: child.email || '—' },
            { label: 'الفترة', value: PeriodLabels[child.period] },
            { label: 'الحالة', value: child.isActive ? 'نشط' : 'مؤرشف' },
          ].map((r) => (
            <div key={r.label} className="flex flex-col gap-1 rounded-md border border-neutral-200 p-3">
              <span className="text-xs text-neutral-500">{r.label}</span>
              <span className="text-sm font-medium text-neutral-900">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}