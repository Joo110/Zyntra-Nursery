import { Modal } from '@/components/modals/Modal';
import { GenderBadge } from '@/components/common/GenderBadge';
import { useTeacher } from '../hooks/useTeachers';
import { PageLoader } from '@/components/loading/PageLoader';
import { PeriodLabels } from '@/types/enums.types';

interface Props {
  branchId: string;
  teacherId: string | null;
  onClose: () => void;
}

export function TeacherDetailsModal({ branchId, teacherId, onClose }: Props) {
  const { data: teacher, isLoading } = useTeacher(branchId, teacherId ?? undefined);

  return (
    <Modal isOpen={!!teacherId} onClose={onClose} title="بيانات المعلم">
      {isLoading || !teacher ? (
        <PageLoader label="جاري تحميل بيانات المعلم..." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: 'الاسم', value: teacher.name || '—' },
            { label: 'النوع', value: <GenderBadge gender={teacher.gender} /> },
            { label: 'المستوى', value: teacher.levelName || '—' },
            { label: 'الفصل', value: teacher.className || '—' },
            { label: 'رقم الهاتف', value: <span className="ltr-numerals">{teacher.phoneNumber || '—'}</span> },
            { label: 'المؤهل', value: teacher.qualification || '—' },
            { label: 'الجامعة/المدرسة', value: teacher.school || '—' },
            { label: 'الرقم القومي', value: <span className="ltr-numerals">{teacher.personalCardNumber || '—'}</span> },
            { label: 'البريد الإلكتروني', value: teacher.email || '—' },
            { label: 'العنوان', value: teacher.address || '—' },
            { label: 'الفترة', value: PeriodLabels[teacher.period] },
            { label: 'تاريخ الميلاد', value: <span className="ltr-numerals">{teacher.dateOfBirth?.slice(0, 10)}</span> },
            { label: 'الراتب', value: <span className="ltr-numerals">{teacher.salary?.toLocaleString('ar-EG') ?? '—'}</span> },
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