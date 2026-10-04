import { useEffect, useState } from 'react';
import { Modal } from '@/components/modals/Modal';
import { Button } from '@/components/common/Button';
import type { PaymentSubscriptionInfoDto, UpdateSubscriptionDto } from '../types/subscription.types';

interface Props {
  row: PaymentSubscriptionInfoDto | null;
  subscriptionId: string | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (dto: UpdateSubscriptionDto) => void;
}

type Mode = 'pay' | 'edit';

const inputCls =
  'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm ltr-numerals focus:border-primary focus:outline-none';

export function PayModal({ row, subscriptionId, isLoading, onClose, onConfirm }: Props) {
  const [mode, setMode] = useState<Mode>('pay');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (row) {
      setMode('pay');
      setValue(String(row.amount));
    }
  }, [row]);

  if (!row) return null;

  const num = Number(value);
  const valid = value !== '' && !Number.isNaN(num) && num > 0;
  const remainingAfterPay = Math.max(0, row.amount - (mode === 'pay' ? num : 0));
  const fullPay = mode === 'pay' && valid && num >= row.amount;

  const switchMode = (m: Mode) => {
    setMode(m);
    setValue(String(row.amount));
  };

  const submit = () => {
    if (!subscriptionId || !valid) return;

    if (mode === 'edit') {
      onConfirm({ id: subscriptionId, amount: num });
      return;
    }
    if (fullPay) {
      onConfirm({ id: subscriptionId, isPaid: true, dateOfPayment: new Date().toISOString() });
    } else {
      // دفع جزئي: المتبقي يحل محل amount ويفضل غير مدفوع
      onConfirm({ id: subscriptionId, amount: row.amount - num });
    }
  };

  const fmt = (n: number) => `${n.toLocaleString('ar-EG')} ج.م`;

  return (
    <Modal isOpen={!!row} onClose={onClose} title="دفع / تعديل الاشتراك">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-neutral-50 p-3 text-sm">
          <p className="font-semibold text-neutral-900">{row.name}</p>
          <p className="mt-1 text-neutral-600">
            المبلغ المستحق الحالي: <span className="font-bold ltr-numerals">{fmt(row.amount)}</span>
          </p>
        </div>

        <div className="flex gap-2">
          {(['pay', 'edit'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === m ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {m === 'pay' ? 'دفع' : 'تعديل المتبقي'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            {mode === 'pay' ? 'المبلغ المدفوع الآن' : 'القيمة الجديدة للمتبقي'}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            className={inputCls}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {mode === 'pay' && valid && (
          <div className="rounded-lg border border-neutral-200 p-3 text-sm">
            {fullPay ? (
              <p className="font-semibold text-green-700">سيتم تسجيل الاشتراك كمدفوع بالكامل</p>
            ) : (
              <p className="text-neutral-700">
                المتبقي بعد الدفع: <span className="font-bold ltr-numerals">{fmt(remainingAfterPay)}</span>
              </p>
            )}
          </div>
        )}

        {!subscriptionId && (
          <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">
            لا يمكن التنفيذ: الـ API لا يرجّع subscriptionId لهذا الصف.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button onClick={submit} disabled={!valid || !subscriptionId || isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'تأكيد'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}