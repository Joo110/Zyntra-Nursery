import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { addMessageArchiveSchema, type AddMessageArchiveFormValues } from '../types/messageArchive.schema';
import { Select } from '@/components/forms/Select';
import { Textarea } from '@/components/forms/Textarea';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { MemberTypeSelector } from '@/components/common/MemberTypeSelector';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { MemberType, SentVia, SentViaLabels, Period } from '@/types/enums.types';

interface Props {
  branchId: string;
  departmentId: string;
  onSubmit: (values: AddMessageArchiveFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function MessageArchiveForm({ branchId, departmentId, onSubmit, isLoading, onCancel }: Props) {
  const [memberType, setMemberType] = useState<MemberType>(MemberType.Child);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(addMessageArchiveSchema),
    defaultValues: { sentVia: SentVia.WhatsApp },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddMessageArchiveFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="نوع العضو" required htmlFor="memberType">
        <MemberTypeSelector value={memberType} onChange={setMemberType} />
      </FormField>

      <FormField label="العضو" required error={errors.memberId?.message} htmlFor="memberId">
        <Controller
          control={control}
          name="memberId"
          render={({ field }) => (
            <ChildDropdown branchId={branchId} departmentId={departmentId} period={Period.AM} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="وسيلة الإرسال" required htmlFor="sentVia">
        <Select id="sentVia" {...register('sentVia')}>
          <option value={SentVia.WhatsApp}>{SentViaLabels[SentVia.WhatsApp]}</option>
          <option value={SentVia.SMS}>{SentViaLabels[SentVia.SMS]}</option>
          <option value={SentVia.Email}>{SentViaLabels[SentVia.Email]}</option>
        </Select>
      </FormField>

      <FormField label="نص الرسالة" error={errors.messageContant?.message} htmlFor="messageContant">
        <Textarea id="messageContant" {...register('messageContant')} error={errors.messageContant?.message} />
      </FormField>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
