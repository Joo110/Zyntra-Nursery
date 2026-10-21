import { useEffect, useState } from 'react';
import { Modal } from '@/components/modals/Modal';
import { Button } from '@/components/common/Button';
import type { PaymentSubscriptionInfoDto, UpdateSubscriptionDto } from '../types/subscription.types';

export interface PayMeta {
  kind: 'pay' | 'edit';
  paid: number;      // اللي اتدفع دلوقتي (0 في التعديل)
  remainder: number; // اللي فاضل بعد العملية
}

interface Props {
  row: PaymentSubscriptionInfoDto | null;
  subscriptionId: string | null;
  userId: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (dto: UpdateSubscriptionDto, meta: PayMeta) => void;
}

type Mode = 'pay' | 'edit';

const inputCls =
  'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm ltr-numerals focus:border-primary focus:outline-none';

const round = (n: number) => Math.round(n * 100) / 100;

export function PayModal({ row, subscriptionId, userId, isLoading, onClose, onConfirm }: Props) {
  const [mode, setMode] = useState<Mode>('pay');
  const [paid, setPaid] = useState('');
  const [remainder, setRemainder] = useState('');
  const [editValue, setEditValue] = useState('');

  const resetFields = (amount: number) => {
    setPaid(String(amount));
    setRemainder('0');
    setEditValue(String(amount));
  };

  useEffect(() => {
    if (row) {
      setMode('pay');
      resetFields(row.amount);
    }
  }, [row]);

  if (!row) return null;

  const current = row.amount;

  // الحقلين مربوطين: مدفوع + متبقي = المتبقي الحالي
  const onPaidChange = (v: string) => {
    setPaid(v);
    const p = Number(v);
    setRemainder(v === '' || Number.isNaN(p) ? '' : String(round(current - p)));
  };

  const onRemainderChange = (v: string) => {
    setRemainder(v);
    const r = Number(v);
    setPaid(v === '' || Number.isNaN(r) ? '' : String(round(current - r)));
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    resetFields(current);
  };

  const p = Number(paid);
  const r = Number(remainder);
  const e = Number(editValue);

  let error: string | undefined;
  let valid = false;

  if (mode === 'pay') {
    if (paid === '' || remainder === '') error = 'أدخل المبلغ';
    else if (Number.isNaN(p) || Number.isNaN(r)) error = 'قيمة غير صحيحة';
    else if (p <= 0) error = 'المبلغ المدفوع يجب أن يكون أكبر من صفر';
    else if (p > current) error = 'المبلغ المدفوع أكبر من المتبقي';
    else if (r < 0) error = 'المتبقي لا يمكن أن يكون سالبًا';
    valid = !error;
  } else {
    valid = editValue !== '' && !Number.isNaN(e) && e > 0;
  }

  const fullPay = mode === 'pay' && valid && r === 0;

  const submit = () => {
    if (!subscriptionId || !userId || !valid) return;

    if (mode === 'edit') {
      onConfirm({ id: subscriptionId, userId, amount: e }, { kind: 'edit', paid: 0, remainder: e });
      return;
    }

    if (fullPay) {
      onConfirm(
        { id: subscriptionId, userId, isPaid: true, dateOfPayment: new Date().toISOString() },
        { kind: 'pay', paid: p, remainder: 0 }
      );
    } else {
      // دفع جزئي: الـ API بيستقبل المتبقي الجديد في amount
      onConfirm({ id: subscriptionId, userId, amount: r }, { kind: 'pay', paid: p, remainder: r });
    }
  };

  const fmt = (n: number) => `${n.toLocaleString('ar-EG')} ج.م`;

  return (
    <Modal isOpen={!!row} onClose={onClose} title="دفع / تعديل الاشتراك">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-neutral-50 p-3 text-sm">
          <p className="font-semibold text-neutral-900">{row.name}</p>
          <p className="mt-1 text-neutral-600">
            المبلغ المستحق الحالي: <span className="font-bold ltr-numerals">{fmt(current)}</span>
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
              {m === 'pay' ? 'دفع' : 'تعديل / خصم'}
            </button>
          ))}
        </div>

        {mode === 'pay' ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">المبلغ المدفوع الآن</label>
              <input
                type="number"
                min={0}
                step="any"
                className={inputCls}
                value={paid}
                onChange={(ev) => onPaidChange(ev.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">المتبقي بعد الدفع</label>
              <input
                type="number"
                min={0}
                step="any"
                className={inputCls}
                value={remainder}
                onChange={(ev) => onRemainderChange(ev.target.value)}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            {valid && (
              <div className="rounded-lg border border-neutral-200 p-3 text-sm">
                {fullPay ? (
                  <p className="font-semibold text-green-700">سيتم تسجيل الاشتراك كمدفوع بالكامل</p>
                ) : (
                  <p className="text-neutral-700">
                    سيتم تسجيل دفع <span className="font-bold ltr-numerals">{fmt(p)}</span> ويتبقى{' '}
                    <span className="font-bold ltr-numerals">{fmt(r)}</span>
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">القيمة الجديدة للمتبقي</label>
            <input
              type="number"
              min={0}
              step="any"
              className={inputCls}
              value={editValue}
              onChange={(ev) => setEditValue(ev.target.value)}
            />
            <p className="text-xs text-neutral-500">
              هذا تعديل على المبلغ فقط (خصم أو تصحيح) ولا يُسجَّل كدفعة ولا يُطبع له وصل.
            </p>
          </div>
        )}

        {!subscriptionId && (
          <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">
            لا يمكن التنفيذ: الـ API لا يرجّع subscriptionId لهذا الصف.
          </p>
        )}

        {!userId && (
          <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">
            لا يمكن التنفيذ: تعذّر تحديد المستخدم الحالي، برجاء إعادة تسجيل الدخول.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button onClick={submit} disabled={!valid || !subscriptionId || !userId || isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'تأكيد'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}