import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubscriptionSchema, type AddSubscriptionFormValues } from '../types/subscription.schema';
import { Input } from '@/components/forms/Input';
import { DatePicker } from '@/components/forms/DatePicker';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { Printer } from 'lucide-react';
import { Period } from '@/types/enums.types';
import { printSubscriptionReceipt, type SubscriptionReceiptData } from '../hooks/printSubscriptionReceipt';
import { useDepartmentChildren } from '@/modules/Children/hooks/useChildren';

const CENTER_INFO = {
  name:    'حضانة أجيال',
  phone:   '01066309169',
  address: 'قرية 4/13 خط عرابي (حضانة أجيال المستقبل)',
  logoUrl: '',
};

interface Props {
  branchId: string;
  departmentId: string;
  period: Period;
  // لازم ترجع true لو الحفظ نجح، عشان نقدر نعرض الوصل بعدها بأمان
  onSubmit: (values: AddSubscriptionFormValues) => Promise<boolean>;
  isLoading?: boolean;
  onCancel: () => void;
}

export function SubscriptionForm({
  branchId, departmentId, period, onSubmit, isLoading, onCancel,
}: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: { isPaid: false, monthSubscription: new Date().toISOString().slice(0, 10) },
  });

  // نفس قائمة الأطفال اللي بيستخدمها ChildDropdown، بنستخدمها هنا لعمل lookup لاسم الطالب
  // (React Query هيرجعها من الكاش من غير ريكوست إضافي طالما نفس query key)
  const { data: children } = useDepartmentChildren(branchId, departmentId ?? '', period);

  const [pendingReceipt, setPendingReceipt] = useState<SubscriptionReceiptData | null>(null);

  const handleFormSubmit = async (data: AddSubscriptionFormValues) => {
    const values = data as AddSubscriptionFormValues;
    const succeeded = await onSubmit(values);

    if (succeeded && values.isPaid) {
      const now = new Date().toISOString();
      const childName = children?.find((c) => c.id === values.childId)?.name ?? '—';
      setPendingReceipt({
        childName,
        amount:            Number(values.amount) || 0,
        monthSubscription: values.monthSubscription,
        dateOfPayment:     values.dateOfPayment ?? now,
        remainder:         0, // لو دُفع بالكامل وقت الإنشاء
        receiptNo:         Date.now().toString(36).toUpperCase(),
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField label="الطالب" required error={errors.childId?.message} htmlFor="childId">
          <Controller
            control={control}
            name="childId"
            render={({ field }) => (
              <ChildDropdown branchId={branchId} departmentId={departmentId} period={period} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
        <FormField label="شهر الاشتراك" required error={errors.monthSubscription?.message} htmlFor="monthSubscription">
          <DatePicker id="monthSubscription" {...register('monthSubscription')} error={errors.monthSubscription?.message} />
        </FormField>
        <FormField label="المبلغ" required error={errors.amount?.message} htmlFor="amount">
          <Input id="amount" type="number" step="0.01" className="ltr-numerals" {...register('amount')} error={errors.amount?.message} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" {...register('isPaid')} className="h-4 w-4 accent-primary" />
          تم الدفع بالفعل
        </label>
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
        </div>
      </form>

      {/* مودال تأكيد الطباعة بعد نجاح الحفظ — نفس فكرة pendingPrintData في FinancePage */}
      {pendingReceipt && (
        <Modal
          isOpen={!!pendingReceipt}
          title="طباعة وصل الاشتراك"
          onClose={() => { setPendingReceipt(null); onCancel(); }}
          size="sm"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Printer className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-slate-700 font-semibold">تم تسجيل الاشتراك بنجاح</p>
            <p className="text-sm text-slate-500">
              هل تريد طباعة وصل لـ <strong>{pendingReceipt.childName}</strong>؟
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { printSubscriptionReceipt(pendingReceipt, CENTER_INFO); setPendingReceipt(null); onCancel(); }}
                className="btn-primary flex-1 justify-center gap-2"
              >
                <Printer className="h-4 w-4" /> طباعة الوصل
              </button>
              <button onClick={() => { setPendingReceipt(null); onCancel(); }} className="btn-secondary flex-1 justify-center">
                تخطي
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}