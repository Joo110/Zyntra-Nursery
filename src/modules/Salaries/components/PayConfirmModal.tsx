import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/modals/Modal';
import { Button } from '@/components/common/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  isLoading?: boolean;
}

export function PayConfirmModal({ isOpen, onClose, onConfirm, message, isLoading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="دفع الراتب" size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm text-neutral-600">{message}</p>
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'جاري الدفع...' : 'تأكيد الدفع'}
          </Button>
          <Button className="flex-1" variant="secondary" onClick={onClose} disabled={isLoading}>
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}