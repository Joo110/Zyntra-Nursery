import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addGraduationSchema, type AddGraduationFormValues } from '../types/graduation.schema';
import { Input } from '@/components/forms/Input';
import { DatePicker } from '@/components/forms/DatePicker';
import { Select } from '@/components/forms/Select';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Gender, GenderLabels } from '@/types/enums.types';
import type { GraduationDto } from '../types/graduation.types';

interface Props {
  initialData?: GraduationDto;
  onSubmit: (values: AddGraduationFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function GraduationForm({ initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addGraduationSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      dateOfJoin: initialData?.dateOfJoin?.slice(0, 10) ?? '',
      dateOfGraduation: initialData?.dateOfGraduation?.slice(0, 10) ?? '',
      gender: initialData?.gender ?? Gender.male,
    },
  });

  useEffect(() => {
    if (initialData) reset({
      name: initialData.name,
      dateOfJoin: initialData.dateOfJoin.slice(0, 10),
      dateOfGraduation: initialData.dateOfGraduation.slice(0, 10),
      gender: initialData.gender,
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddGraduationFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="الاسم" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>
      <FormField label="تاريخ الالتحاق" required error={errors.dateOfJoin?.message} htmlFor="dateOfJoin">
        <DatePicker id="dateOfJoin" {...register('dateOfJoin')} error={errors.dateOfJoin?.message} />
      </FormField>
      <FormField label="تاريخ التخرج" required error={errors.dateOfGraduation?.message} htmlFor="dateOfGraduation">
        <DatePicker id="dateOfGraduation" {...register('dateOfGraduation')} error={errors.dateOfGraduation?.message} />
      </FormField>
      <FormField label="النوع" required htmlFor="gender">
        <Select id="gender" {...register('gender')}>
          <option value={Gender.male}>{GenderLabels[Gender.male]}</option>
          <option value={Gender.female}>{GenderLabels[Gender.female]}</option>
        </Select>
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
