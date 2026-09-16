import { Modal } from '@/components/modals/Modal';
import { WorkerForm } from './WorkerForm';
import { useWorker, useUpdateWorker } from '../hooks/useWorkers';
import type { AddWorkerFormValues } from '../types/worker.schema';
import type { Gender, Period } from '@/types/enums.types';
import { PageLoader } from '@/components/loading/PageLoader';

interface Props {
  branchId: string;
  workerId: string | null;
  onClose: () => void;
}

export function WorkerEditModal({ branchId, workerId, onClose }: Props) {
  const { data: worker, isLoading } = useWorker(branchId, workerId ?? undefined);
  const updateWorker = useUpdateWorker(branchId);

  const handleSubmit = (values: AddWorkerFormValues) => {
    if (!workerId) return;
    updateWorker.mutate(
      {
        id: workerId,
        name: values.name,
        phone: values.phone,
        personalCardNumber: values.personalCardNumber,
        gender: values.gender as Gender,
        salary: values.salary,
        period: values.period as Period,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={!!workerId} onClose={onClose} title="تعديل بيانات العامل">
      {isLoading || !worker ? (
        <PageLoader label="جاري تحميل بيانات العامل..." />
      ) : (
        <WorkerForm
          initialData={{
            name: worker.name,
            phone: worker.phone,
            personalCardNumber: worker.personalCardNumber,
            gender: worker.gender,
            salary: worker.salary,
            period: worker.period,
          }}
          onSubmit={handleSubmit}
          isLoading={updateWorker.isPending}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}