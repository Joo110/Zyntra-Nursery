import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '@/components/common/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
}

/**
 * تأكيد قياسي لعمليات الحذف العادية (عنصر واحد) — راجع Master Prompt § 20 Delete Confirmation.
 * للعمليات المدمّرة (Delete All, Reset) استخدم DangerConfirmModal بدلًا من هذا.
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  confirmLabel = 'حذف',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-6 w-6 text-danger" />
        </div>
        <p className="text-sm text-neutral-600">{message}</p>
        <div className="mt-2 flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
