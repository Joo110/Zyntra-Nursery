import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addBusSchema, type AddBusFormValues } from '../types/bus.schema';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/forms/Select';
import { useDriversDropdown } from '@/modules/Drivers/hooks/useDrivers';
import type { BusListDto } from '../types/bus.types';

interface BusFormProps {
  branchId: string;
  initialData?: BusListDto;
  onSubmit: (values: AddBusFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function BusForm({ branchId, initialData, onSubmit, isLoading, onCancel }: BusFormProps) {
  const { data: drivers } = useDriversDropdown(branchId);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addBusSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      subFees: initialData?.subFees ?? 0,
      capacity: initialData?.capacity ?? 1,
      driverId: initialData?.driverId ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        subFees: initialData.subFees,
        capacity: initialData.capacity,
        driverId: initialData.driverId,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddBusFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="اسم الباص" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>

      <FormField label="رسوم الاشتراك" required error={errors.subFees?.message} htmlFor="subFees">
        <Input id="subFees" type="number" step="0.01" className="ltr-numerals" {...register('subFees')} error={errors.subFees?.message} />
      </FormField>

      <FormField label="السعة (عدد المقاعد)" required error={errors.capacity?.message} htmlFor="capacity">
        <Input id="capacity" type="number" className="ltr-numerals" {...register('capacity')} error={errors.capacity?.message} />
      </FormField>

  <FormField label="السائق" required error={errors.driverId?.message} htmlFor="driverId">
  <Controller
    control={control}
    name="driverId"
    render={({ field }) => (
      <Select id="driverId" value={field.value} onChange={field.onChange}>
        <option value="">اختر السائق</option>
        {drivers?.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </Select>
    )}
  />
</FormField>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
