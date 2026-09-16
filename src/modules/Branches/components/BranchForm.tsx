import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addBranchSchema, type AddBranchFormValues } from '../types/branch.schema';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import type { BranchListDto } from '../types/branch.types';

interface BranchFormProps {
  initialData?: BranchListDto;
  onSubmit: (values: AddBranchFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function BranchForm({ initialData, onSubmit, isLoading, onCancel }: BranchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBranchFormValues>({
    resolver: zodResolver(addBranchSchema),
    defaultValues: {
      branchName: initialData?.branchName ?? '',
      address: initialData?.address ?? '',
      phone: initialData?.phone ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        branchName: initialData.branchName,
        address: initialData.address ?? '',
        phone: initialData.phone ?? '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FormField label="اسم الفرع" required error={errors.branchName?.message} htmlFor="branchName">
        <Input id="branchName" {...register('branchName')} error={errors.branchName?.message} />
      </FormField>

      <FormField label="العنوان" error={errors.address?.message} htmlFor="address">
        <Input id="address" {...register('address')} error={errors.address?.message} />
      </FormField>

      <FormField label="رقم الهاتف" error={errors.phone?.message} htmlFor="phone">
        <Input id="phone" {...register('phone')} error={errors.phone?.message} />
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
