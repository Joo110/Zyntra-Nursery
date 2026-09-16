import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addWorkerSchema, type AddWorkerFormValues } from '../types/worker.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Gender, GenderLabels, Period, PeriodLabels } from '@/types/enums.types';

interface Props {
  initialData?: Partial<AddWorkerFormValues>;
  onSubmit: (values: AddWorkerFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function WorkerForm({ initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addWorkerSchema),
    defaultValues: {
      gender: Gender.male,
      period: Period.AM,
      salary: 0,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddWorkerFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="الاسم" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>
      <FormField label="رقم الهاتف" required error={errors.phone?.message} htmlFor="phone">
        <Input id="phone" className="ltr-numerals" {...register('phone')} error={errors.phone?.message} />
      </FormField>
      <FormField label="الرقم القومي" error={errors.personalCardNumber?.message} htmlFor="personalCardNumber">
        <Input id="personalCardNumber" className="ltr-numerals" {...register('personalCardNumber')} error={errors.personalCardNumber?.message} />
      </FormField>
      <FormField label="النوع" required htmlFor="gender">
        <Select id="gender" {...register('gender')}>
          <option value={Gender.male}>{GenderLabels[Gender.male]}</option>
          <option value={Gender.female}>{GenderLabels[Gender.female]}</option>
        </Select>
      </FormField>
      <FormField label="الفترة" required htmlFor="period">
        <Select id="period" {...register('period')}>
          <option value={Period.AM}>{PeriodLabels[Period.AM]}</option>
          <option value={Period.PM}>{PeriodLabels[Period.PM]}</option>
        </Select>
      </FormField>
      <FormField label="الراتب" required error={errors.salary?.message} htmlFor="salary">
        <Input id="salary" type="number" step="0.01" className="ltr-numerals" {...register('salary')} error={errors.salary?.message} />
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}