import { Printer } from 'lucide-react';
import { Modal } from '@/components/modals/Modal';
import { printSubscriptionReceipt, type SubscriptionReceiptData } from '../hooks/printSubscriptionReceipt';
import { CENTER_INFO } from '../../../constants/centerInfo';

interface Props {
  receipt: SubscriptionReceiptData | null;
  onClose: () => void;
}

export function ReceiptPrompt({ receipt, onClose }: Props) {
  if (!receipt) return null;

  return (
    <Modal isOpen title="طباعة وصل الاشتراك" onClose={onClose} size="sm">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Printer className="h-8 w-8 text-emerald-600" />
        </div>
        <p className="font-semibold text-slate-700">تم تسجيل الدفع بنجاح</p>
        <p className="text-sm text-slate-500">
          هل تريد طباعة وصل لـ <strong>{receipt.childName}</strong>؟
        </p>
        <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
          <p>
            المدفوع:{' '}
            <span className="font-bold ltr-numerals">{receipt.amount.toLocaleString('ar-EG')} ج.م</span>
          </p>
          <p>
            المتبقي:{' '}
            <span className="font-bold ltr-numerals">{receipt.remainder.toLocaleString('ar-EG')} ج.م</span>
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              printSubscriptionReceipt(receipt, CENTER_INFO);
              onClose();
            }}
            className="btn-primary flex-1 justify-center gap-2"
          >
            <Printer className="h-4 w-4" /> طباعة الوصل
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            تخطي
          </button>
        </div>
      </div>
    </Modal>
  );
}