import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { addTreasurySchema, type AddTreasuryFormValues } from '../types/treasury.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { MemberTypeSelector } from '@/components/common/MemberTypeSelector';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { MemberType, TrunsactionType, TrunsactionTypeLabels, Period } from '@/types/enums.types';

interface Props {
  branchId: string;
  departmentId: string;
  onSubmit: (values: AddTreasuryFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

/**
 * راجع 03-Business-Flow.md § Treasury Flow — MemberType أولًا، ثم اختيار العضو الفعلي
 * (Polymorphic MemberId+MemberType pattern). لا يوجد حقل TreasuryKind بالإضافة اليدوية
 * (فقط TrunsactionType دخل/صرف) — راجع 02-API-Contract-Detailed.md § 15.
 */
export function TreasuryForm({ branchId, departmentId, onSubmit, isLoading, onCancel }: Props) {
  const [memberType, setMemberType] = useState<MemberType>(MemberType.Child);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(addTreasurySchema),
    defaultValues: { trunsactionType: TrunsactionType.Income },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as AddTreasuryFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="نوع العضو" required htmlFor="memberType">
        <MemberTypeSelector value={memberType} onChange={setMemberType} />
      </FormField>

      {memberType === MemberType.Child ? (
        <FormField label="العضو" required error={errors.memberId?.message} htmlFor="memberId">
          <Controller
            control={control}
            name="memberId"
            render={({ field }) => (
              <ChildDropdown branchId={branchId} departmentId={departmentId} period={Period.AM} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
      ) : (
        <FormField label="معرّف العضو" required error={errors.memberId?.message} htmlFor="memberId">
          <Input id="memberId" {...register('memberId')} error={errors.memberId?.message} placeholder="معرّف المعلم/العامل" />
        </FormField>
      )}

      <FormField label="نوع الحركة" required htmlFor="trunsactionType">
        <Select id="trunsactionType" {...register('trunsactionType')}>
          <option value={TrunsactionType.Income}>{TrunsactionTypeLabels[TrunsactionType.Income]}</option>
          <option value={TrunsactionType.Expenses}>{TrunsactionTypeLabels[TrunsactionType.Expenses]}</option>
        </Select>
      </FormField>

      <FormField label="المبلغ" required error={errors.amount?.message} htmlFor="amount">
        <Input id="amount" type="number" step="0.01" className="ltr-numerals" {...register('amount')} error={errors.amount?.message} />
      </FormField>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
