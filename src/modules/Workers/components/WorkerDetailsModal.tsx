import { Modal } from '@/components/modals/Modal';
import { GenderBadge } from '@/components/common/GenderBadge';
import { useWorker } from '../hooks/useWorkers';
import { PageLoader } from '@/components/loading/PageLoader';
import { PeriodLabels } from '@/types/enums.types';
interface Props {
  branchId: string;
  workerId: string | null;
  onClose: () => void;
}

export function WorkerDetailsModal({ branchId, workerId, onClose }: Props) {
  const { data: worker, isLoading } = useWorker(branchId, workerId ?? undefined);

  return (
    <Modal isOpen={!!workerId} onClose={onClose} title="بيانات العامل">
      {isLoading || !worker ? (
        <PageLoader label="جاري تحميل بيانات العامل..." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: 'الاسم', value: worker.name || '—' },
            { label: 'النوع', value: <GenderBadge gender={worker.gender} /> },
            { label: 'رقم الهاتف', value: <span className="ltr-numerals">{worker.phone || '—'}</span> },
            { label: 'الرقم القومي', value: <span className="ltr-numerals">{worker.personalCardNumber || '—'}</span> },
            { label: 'الراتب', value: <span className="ltr-numerals">{worker.salary?.toLocaleString('ar-EG') ?? '—'}</span> },
            { label: 'الفترة', value: PeriodLabels[worker.period] },
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