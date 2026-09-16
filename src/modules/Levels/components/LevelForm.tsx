import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addLevelSchema, type AddLevelFormValues } from '../types/level.schema';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { LevelDto } from '../types/level.types';

interface Props {
  initialData?: LevelDto;
  onSubmit: (values: AddLevelFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function LevelForm({ initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddLevelFormValues>({
    resolver: zodResolver(addLevelSchema),
    defaultValues: { levelName: initialData?.levelName ?? '', levelContent: initialData?.levelContent ?? '' },
  });

  useEffect(() => {
    if (initialData) reset({ levelName: initialData.levelName ?? '', levelContent: initialData.levelContent ?? '' });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FormField label="اسم المستوى" required error={errors.levelName?.message} htmlFor="levelName">
        <Input id="levelName" {...register('levelName')} error={errors.levelName?.message} />
      </FormField>
      <FormField label="محتوى المستوى" error={errors.levelContent?.message} htmlFor="levelContent">
        <Textarea id="levelContent" {...register('levelContent')} error={errors.levelContent?.message} />
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
