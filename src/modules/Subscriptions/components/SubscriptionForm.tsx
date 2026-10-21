import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubscriptionSchema, type AddSubscriptionFormValues } from '../types/subscription.schema';
import { Input } from '@/components/forms/Input';
import { DatePicker } from '@/components/forms/DatePicker';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Period } from '@/types/enums.types';
import type { SubscriptionReceiptData } from '../hooks/printSubscriptionReceipt';
import { ReceiptPrompt } from './ReceiptPrompt';
import { useDepartmentChildren } from '@/modules/Children/hooks/useChildren';

interface Props {
  branchId: string;
  departmentId: string;
  period: Period;
  onSubmit: (values: AddSubscriptionFormValues) => Promise<boolean>;
  isLoading?: boolean;
  onCancel: () => void;
}

export function SubscriptionForm({
  branchId, departmentId: initialDepartmentId, period, onSubmit, isLoading, onCancel,
}: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: { isPaid: false, monthSubscription: new Date().toISOString().slice(0, 10) },
  });

  const [departmentId, setDepartmentId] = useState(initialDepartmentId ?? '');
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
        amount: Number(values.amount) || 0,
        monthSubscription: values.monthSubscription,
        dateOfPayment: values.dateOfPayment ?? now,
        remainder: 0, // اتدفع بالكامل وقت الإنشاء
        receiptNo: Date.now().toString(36).toUpperCase(),
      });
    }
  };

  const closeReceipt = () => {
    setPendingReceipt(null);
    onCancel();
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField label="القسم" htmlFor="departmentId">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={setDepartmentId} />
        </FormField>
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

      <ReceiptPrompt receipt={pendingReceipt} onClose={closeReceipt} />
    </>
  );
}