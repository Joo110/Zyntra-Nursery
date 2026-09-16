import { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';

interface DangerConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmWord?: string;
  isLoading?: boolean;
}

/**
 * تأكيد للعمليات المدمّرة (DELETE /all, reset-daily) - يتطلب كتابة كلمة تأكيد
 * قبل تفعيل الزر النهائي (راجع 04-...md § Shared Components: DangerConfirmModal).
 */
export function DangerConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmWord = 'حذف',
  isLoading,
}: DangerConfirmModalProps) {
  const [typed, setTyped] = useState('');
  const isMatch = typed.trim() === confirmWord;

  const handleClose = () => {
    setTyped('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <AlertOctagon className="h-6 w-6 text-danger" />
        </div>
        <p className="text-sm text-neutral-600">{message}</p>
        <p className="text-xs text-neutral-500">
          للتأكيد، اكتب كلمة "<span className="font-bold text-danger">{confirmWord}</span>" بالمربع أدناه:
        </p>
        <Input value={typed} onChange={(e) => setTyped(e.target.value)} className="text-center" />
        <div className="mt-2 flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={!isMatch}
            isLoading={isLoading}
          >
            تأكيد
          </Button>
        </div>
      </div>
    </Modal>
  );
}
