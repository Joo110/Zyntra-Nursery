import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addDepartmentSchema, type AddDepartmentFormValues } from '../types/department.schema';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { DepartmentListDto } from '../types/department.types';
import { WEEKDAYS } from '../constants/weekdays';

interface DepartmentFormProps {
  initialData?: DepartmentListDto;
  onSubmit: (values: AddDepartmentFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

function dayDefaults(d?: DepartmentListDto) {
  return {
    worksSunday: d?.worksSunday ?? false,
    worlsMonday: d?.worlsMonday ?? false,
    worksTuesday: d?.worksTuesday ?? false,
    worksWednesday: d?.worksWednesday ?? false,
    worksThursday: d?.worksThursday ?? false,
    worksFriday: d?.worksFriday ?? false,
    worksSaturday: d?.worksSaturday ?? false,
    isPrimaryDepartment: d?.isPrimaryDepartment ?? false,
  };
}

export function DepartmentForm({ initialData, onSubmit, isLoading, onCancel }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      departmentName: initialData?.departmentName ?? '',
      subscriptionPrice: initialData?.subscriptionPrice ?? 0,
      ...dayDefaults(initialData),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        departmentName: initialData.departmentName,
        subscriptionPrice: initialData.subscriptionPrice,
        ...dayDefaults(initialData),
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddDepartmentFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="اسم القسم" required error={errors.departmentName?.message} htmlFor="departmentName">
        <Input id="departmentName" {...register('departmentName')} error={errors.departmentName?.message} />
      </FormField>

      <FormField
        label="سعر الاشتراك الشهري"
        required
        error={errors.subscriptionPrice?.message}
        htmlFor="subscriptionPrice"
      >
        <Input
          id="subscriptionPrice"
          type="number"
          step="0.01"
          className="ltr-numerals"
          {...register('subscriptionPrice')}
          error={errors.subscriptionPrice?.message}
        />
      </FormField>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-neutral-700">أيام العمل</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WEEKDAYS.map((day) => (
            <label key={day.key} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" className="h-4 w-4 accent-primary" {...register(day.key)} />
              {day.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700">
        <input type="checkbox" className="h-4 w-4 accent-primary" {...register('isPrimaryDepartment')} />
        قسم أساسي (يظهر له الفصول في الحضور والانصراف والغياب)
      </label>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
          إلغاء
        </Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>
          حفظ
        </Button>
      </div>
    </form>
  );
}
