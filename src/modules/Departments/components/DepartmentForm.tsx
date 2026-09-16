import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addDepartmentSchema, type AddDepartmentFormValues } from '../types/department.schema';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { DepartmentListDto } from '../types/department.types';

interface DepartmentFormProps {
  initialData?: DepartmentListDto;
  onSubmit: (values: AddDepartmentFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
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
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({ departmentName: initialData.departmentName, subscriptionPrice: initialData.subscriptionPrice });
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
