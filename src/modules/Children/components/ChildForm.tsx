import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addChildSchema, type AddChildFormValues } from '../types/child.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Gender, GenderLabels, Period, PeriodLabels } from '@/types/enums.types';
import { useLevelsList } from '@/modules/Levels/hooks/useLevels';
import { useClassroomsList } from '@/modules/Classrooms/hooks/useClassrooms';
import { useDepartmentsDropdown } from '@/modules/Departments/hooks/useDepartments';
import { BusDropdown } from '@/components/common/BusDropdown';

interface ChildFormProps {
  branchId: string;
  initialData?: Partial<AddChildFormValues>;
  onSubmit: (values: AddChildFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
  /** يفرّق بين الإضافة والتعديل لعرض ملاحظات خاصة بقيود الباك (مثل busId عند الإنشاء) */
  mode?: 'create' | 'edit';
}

/**
 * فورم إضافة/تعديل طالب — مقسّم لأقسام (راجع Master Prompt § 29 Forms).
 * يعتمد على ClassId/LevelId من نفس الفرع (راجع Business Rule بـ AddChildAsync — 03-Business-Flow.md).
 */
export function ChildForm({ branchId, initialData, onSubmit, isLoading, onCancel, mode = 'create' }: ChildFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      city: initialData?.city ?? '',
      address: initialData?.address ?? '',
      dateOfBirth: initialData?.dateOfBirth ?? '',
      levelId: initialData?.levelId ?? '',
      classId: initialData?.classId ?? '',
      dateOfSubscraip: initialData?.dateOfSubscraip ?? new Date().toISOString().slice(0, 10),
      departmentId: initialData?.departmentId ?? [],
      gender: initialData?.gender ?? Gender.male,
      callPhoneNumber: initialData?.callPhoneNumber ?? '',
      period: initialData?.period ?? Period.AM,
      subscirptionAmount: initialData?.subscirptionAmount ?? 0,
      howYouKnowNursery: initialData?.howYouKnowNursery ?? 0,
      messageNumber: initialData?.messageNumber ?? '',
      email: initialData?.email ?? '',
      busId: initialData?.busId ?? '',
      isAdvancePaymentMade: initialData?.isAdvancePaymentMade ?? false,
      advancePaymentAmount: initialData?.advancePaymentAmount ?? 0,
    },
  });

  const isAdvancePaymentMade = useWatch({ control, name: 'isAdvancePaymentMade' });

  const { data: levels } = useLevelsList(branchId, 1, 100);
  const { data: classrooms } = useClassroomsList(branchId, 1, 100);
  const { data: departments } = useDepartmentsDropdown(branchId);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddChildFormValues))} className="flex flex-col gap-6" noValidate>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-700">بيانات الطالب</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="اسم الطالب" error={errors.name?.message} htmlFor="name">
            <Input id="name" {...register('name')} error={errors.name?.message} />
          </FormField>
          <FormField label="تاريخ الميلاد" required error={errors.dateOfBirth?.message} htmlFor="dateOfBirth">
            <DatePicker id="dateOfBirth" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
          </FormField>
          <FormField label="المدينة" required error={errors.city?.message} htmlFor="city">
            <Input id="city" {...register('city')} error={errors.city?.message} />
          </FormField>
          <FormField label="العنوان" required error={errors.address?.message} htmlFor="address">
            <Input id="address" {...register('address')} error={errors.address?.message} />
          </FormField>
          <FormField label="النوع" required error={errors.gender?.message} htmlFor="gender">
            <Select id="gender" {...register('gender')}>
              {Object.values(Gender).filter((v) => typeof v === 'number').map((g) => (
                <option key={g} value={g}>{GenderLabels[g as Gender]}</option>
              ))}
            </Select>
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-700">البيانات الأكاديمية</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="المستوى" required error={errors.levelId?.message} htmlFor="levelId">
            <Select id="levelId" {...register('levelId')} error={errors.levelId?.message}>
              <option value="">اختر المستوى</option>
              {levels?.items.map((l) => <option key={l.id} value={l.id}>{l.levelName}</option>)}
            </Select>
          </FormField>
          <FormField label="الفصل" required error={errors.classId?.message} htmlFor="classId">
            <Select id="classId" {...register('classId')} error={errors.classId?.message}>
              <option value="">اختر الفصل</option>
              {classrooms?.items.map((c) => <option key={c.id} value={c.id}>{c.class}</option>)}
            </Select>
          </FormField>
          <FormField label="الفترة" required error={errors.period?.message} htmlFor="period">
            <Select id="period" {...register('period')}>
              {Object.values(Period).filter((v) => typeof v === 'number').map((p) => (
                <option key={p} value={p}>{PeriodLabels[p as Period]}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="الأقسام" required error={errors.departmentId?.message as string | undefined} htmlFor="departmentId">
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <div id="departmentId" className="grid grid-cols-2 gap-2 rounded-md border border-neutral-300 bg-white p-3 sm:grid-cols-3">
                  {departments?.map((d) => {
                    const checked = field.value?.includes(d.id) ?? false;
                    return (
                      <label key={d.id} className="flex items-center gap-2 text-sm text-neutral-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300"
                          checked={checked}
                          onChange={(e) => {
                            const current: string[] = field.value ?? [];
                            const next = e.target.checked
                              ? [...current, d.id]
                              : current.filter((id: string) => id !== d.id);
                            field.onChange(next);
                          }}
                        />
                        {d.departmentName}
                      </label>
                    );
                  })}
                  {!departments?.length && <span className="text-xs text-neutral-400">لا توجد أقسام متاحة بهذا الفرع</span>}
                </div>
              )}
            />
          </FormField>
          <FormField label="الباص" error={errors.busId?.message} htmlFor="busId">
            <Controller
              control={control}
              name="busId"
              render={({ field }) => (
                <BusDropdown branchId={branchId} value={field.value} onChange={field.onChange} />
              )}
            />
        
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-700">بيانات التواصل / ولي الأمر</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="رقم هاتف التواصل" required error={errors.callPhoneNumber?.message} htmlFor="callPhoneNumber">
            <Input id="callPhoneNumber" className="ltr-numerals" {...register('callPhoneNumber')} error={errors.callPhoneNumber?.message} />
          </FormField>
          <FormField label="رقم الرسائل" required error={errors.messageNumber?.message} htmlFor="messageNumber">
            <Input id="messageNumber" className="ltr-numerals" {...register('messageNumber')} error={errors.messageNumber?.message} />
          </FormField>
          <FormField label="البريد الإلكتروني" error={errors.email?.message} htmlFor="email">
            <Input id="email" type="email" className="ltr-numerals" {...register('email')} error={errors.email?.message} />
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-700">بيانات الاشتراك</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="تاريخ الاشتراك" required error={errors.dateOfSubscraip?.message} htmlFor="dateOfSubscraip">
            <DatePicker id="dateOfSubscraip" {...register('dateOfSubscraip')} error={errors.dateOfSubscraip?.message} />
          </FormField>
          <FormField label="مبلغ الاشتراك" required error={errors.subscirptionAmount?.message} htmlFor="subscirptionAmount">
            <Input id="subscirptionAmount" type="number" step="0.01" className="ltr-numerals" {...register('subscirptionAmount')} error={errors.subscirptionAmount?.message} />
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-700">مقدمة الحجز (Advance Payment)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register('isAdvancePaymentMade')} />
            تم دفع المقدمة؟
          </label>
          {isAdvancePaymentMade && (
            <FormField label="مبلغ المقدمة المدفوع" required error={errors.advancePaymentAmount?.message} htmlFor="advancePaymentAmount">
              <Input id="advancePaymentAmount" type="number" step="0.01" className="ltr-numerals" {...register('advancePaymentAmount')} error={errors.advancePaymentAmount?.message} />
            </FormField>
          )}
        </div>
        {isAdvancePaymentMade && (
          <p className="text-xs text-neutral-400">
            ⚠️ يتم تسجيل المقدمة في الخزينة عبر نداء منفصل بعد حفظ الطالب مباشرة (Endpoint: Treasury/child/&#123;childId&#125;/advance-payment)
            — راجع صفحة إضافة/تعديل الطالب.
          </p>
        )}
      </section>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
