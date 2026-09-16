import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addBrotherSchema, type AddBrotherFormValues } from '../types/brother.schema';
import { Input } from '@/components/forms/Input';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { BrotherListDto } from '../types/brother.types';

interface Props {
  initialData?: BrotherListDto;
  onSubmit: (values: AddBrotherFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function BrotherForm({ initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddBrotherFormValues>({
    resolver: zodResolver(addBrotherSchema),
    defaultValues: { name: initialData?.name ?? '', dateOfBirth: initialData?.dateOfBirth?.slice(0, 10) ?? '' },
  });

  useEffect(() => {
    if (initialData) reset({ name: initialData.name, dateOfBirth: initialData.dateOfBirth.slice(0, 10) });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FormField label="الاسم" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>
      <FormField label="تاريخ الميلاد" required error={errors.dateOfBirth?.message} htmlFor="dateOfBirth">
        <DatePicker id="dateOfBirth" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
