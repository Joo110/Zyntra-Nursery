import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualTreasurySchema, type ManualTreasuryFormValues } from '../types/manualTreasury.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { TrunsactionType } from '@/types/enums.types';

interface Props {
  onSubmit: (values: ManualTreasuryFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

/**
 * شاشة الإيداع/السحب اليدوي — لتسجيل أموال جانبية (إيراد إضافي أو مصروف إضافي)
 * لا تخص طفل/معلم/عامل بعينه، باستخدام نفس Endpoint العام لإضافة حركة خزينة.
 */
export function ManualTreasuryForm({ onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(manualTreasurySchema),
    defaultValues: {
      trunsactionType: TrunsactionType.Income,
      amount: 0,
      dateTime: new Date().toISOString().slice(0, 10),
      note: '',
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as ManualTreasuryFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="نوع العملية" required htmlFor="trunsactionType">
        <Controller
          control={control}
          name="trunsactionType"
          render={({ field }) => (
            <Select id="trunsactionType" value={field.value as number} onChange={(e) => field.onChange(Number(e.target.value))}>
              <option value={TrunsactionType.Income}>إيداع (إيراد إضافي)</option>
              <option value={TrunsactionType.Expenses}>سحب (مصروف إضافي)</option>
            </Select>
          )}
        />
      </FormField>

      <FormField label="التاريخ" required error={errors.dateTime?.message} htmlFor="dateTime">
        <DatePicker id="dateTime" {...register('dateTime')} error={errors.dateTime?.message} />
      </FormField>

      <FormField label="المبلغ" required error={errors.amount?.message} htmlFor="amount">
        <Input id="amount" type="number" step="0.01" className="ltr-numerals" {...register('amount')} error={errors.amount?.message} />
      </FormField>

      <FormField label="الملاحظة / سبب الحركة" required error={errors.note?.message} htmlFor="note">
        <Input id="note" {...register('note')} error={errors.note?.message} placeholder="مثال: شراء أدوات نظافة" />
      </FormField>

      <p className="text-xs text-neutral-400">
        ⚠️ حقل الملاحظة لا يُرسل حاليًا للباك (AddTreasuryDataDto لا يدعمه بعد) — يُعرض هنا فقط تمهيدًا
        لإضافته، برجاء تنسيقه مع فريق الباك.
      </p>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ الحركة</Button>
      </div>
    </form>
  );
}
