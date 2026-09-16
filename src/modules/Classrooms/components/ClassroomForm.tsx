import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addClassroomSchema, type AddClassroomFormValues } from '../types/classroom.schema';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { ClassMenuDto } from '../types/classroom.types';

interface Props {
  initialData?: ClassMenuDto;
  onSubmit: (values: AddClassroomFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function ClassroomForm({ initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddClassroomFormValues>({
    resolver: zodResolver(addClassroomSchema),
    defaultValues: { class: initialData?.class ?? '' },
  });

  useEffect(() => {
    if (initialData) reset({ class: initialData.class ?? '' });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FormField label="اسم الفصل" required error={errors.class?.message} htmlFor="class">
        <Input id="class" {...register('class')} error={errors.class?.message} />
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
