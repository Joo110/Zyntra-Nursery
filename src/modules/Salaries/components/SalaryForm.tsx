import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addSalarySchema, type AddSalaryFormInput, type AddSalaryFormValues } from '../types/salary.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { MemberType, MemberTypeLabels } from '../types/enums.types';
import { useTeachersList } from '@/modules/Teachers/hooks/useTeachers';
import { useWorkersList } from '@/modules/Workers/hooks/useWorkers';
import { useEmployeeBaseSalary } from '../hooks/useSalaries';

interface Props {
  branchId: string;
  onSubmit: (values: AddSalaryFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

/** فورم تسجيل/تعديل راتب معلم أو عامل — العضو يُختار حسب نوعه (Teacher/Worker) */
export function SalaryForm({ branchId, onSubmit, isLoading, onCancel }: Props) {
  // نمرر نوعين لـ useForm: نوع الإدخال (Input) قبل الـ coerce، ونوع الإخراج (Output) بعد الـ validation
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddSalaryFormInput, any, AddSalaryFormValues>({
    resolver: zodResolver(addSalarySchema),
    defaultValues: {
      employeeType: MemberType.Teacher,
      isPaid: false,
      amount: 0,
      salaryMonth: new Date().toISOString().slice(0, 7) + '-01',
    },
  });

  const employeeType = watch('employeeType');
  const employeeId = watch('employeeId');

  const { data: teachers } = useTeachersList(branchId, 1, 200);
  const { data: workers } = useWorkersList(branchId, 1, 200);

  // يجيب الراتب الأساسي فور اختيار موظف، لتعبئة حقل المبلغ تلقائيًا
  const { data: baseSalary, isFetching: isFetchingSalary } = useEmployeeBaseSalary(
    branchId,
    employeeType,
    employeeId || undefined
  );

  useEffect(() => {
    if (baseSalary) {
      setValue('amount', baseSalary.amount, { shouldValidate: true });
    }
  }, [baseSalary, setValue]);

  // لما يغيّر نوع الموظف، نصفّر اختيار الموظف والمبلغ عشان منفضلش عالقين على راتب موظف من نوع مختلف
  useEffect(() => {
    setValue('employeeId', '');
    setValue('amount', 0);
  }, [employeeType, setValue]);

  const employeeOptions = employeeType === MemberType.Teacher ? teachers?.items : workers?.items;

  const handleFormSubmit = handleSubmit((values) => {
    // بعد نجاح الـ validation، values بتكون بنوع الإخراج (AddSalaryFormValues)
    onSubmit(values as AddSalaryFormValues);
  });

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" noValidate>
      <FormField label="نوع الموظف" required htmlFor="employeeType">
        <Controller
          control={control}
          name="employeeType"
          render={({ field }) => (
            <Select id="employeeType" value={field.value} onChange={(e) => field.onChange(e.target.value)}>
              <option value={MemberType.Teacher}>{MemberTypeLabels[MemberType.Teacher]}</option>
              <option value={MemberType.Worker}>{MemberTypeLabels[MemberType.Worker]}</option>
            </Select>
          )}
        />
      </FormField>

      <FormField label="الموظف" required error={errors.employeeId?.message} htmlFor="employeeId">
        <Select id="employeeId" {...register('employeeId')} error={errors.employeeId?.message}>
          <option value="">اختر الموظف</option>
          {employeeOptions?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="شهر الراتب" required error={errors.salaryMonth?.message} htmlFor="salaryMonth">
        <DatePicker id="salaryMonth" {...register('salaryMonth')} error={errors.salaryMonth?.message} />
      </FormField>

      <FormField
        label={`المبلغ${isFetchingSalary ? ' (جاري تحميل الراتب الأساسي...)' : ''}`}
        required
        error={errors.amount?.message}
        htmlFor="amount"
      >
        <Input
          id="amount"
          type="number"
          step="0.01"
          className="ltr-numerals"
          disabled={isFetchingSalary}
          {...register('amount')}
          error={errors.amount?.message}
        />
      </FormField>
      {baseSalary && (
        <p className="-mt-2 text-xs text-neutral-500">
          الراتب الأساسي المسجل: <span className="ltr-numerals font-medium">{baseSalary.amount.toLocaleString('ar-EG')}</span> ج.م — يمكنك تعديل المبلغ قبل الحفظ.
        </p>
      )}

      <FormField label="تم الصرف؟" htmlFor="isPaid">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input id="isPaid" type="checkbox" {...register('isPaid')} className="h-4 w-4 rounded border-neutral-300" />
          تم صرف الراتب فعليًا
        </label>
      </FormField>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}