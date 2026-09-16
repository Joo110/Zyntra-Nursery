import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTeacherSchema, type AddTeacherFormValues } from '../types/teacher.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Gender, GenderLabels, Period, PeriodLabels } from '@/types/enums.types';
import { useLevelsList } from '@/modules/Levels/hooks/useLevels';
import { useClassroomsList } from '@/modules/Classrooms/hooks/useClassrooms';

interface Props {
  branchId: string;
  initialData?: Partial<AddTeacherFormValues>;
  onSubmit: (values: AddTeacherFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function TeacherForm({ branchId, initialData, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addTeacherSchema),
    defaultValues: {
      gender: Gender.female,
      period: Period.AM,
      salary: 0,
      ...initialData,
    },
  });
  const { data: levels } = useLevelsList(branchId, 1, 100);
  const { data: classrooms } = useClassroomsList(branchId, 1, 100);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddTeacherFormValues))} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
      <FormField label="الاسم" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>
      <FormField label="المؤهل" required error={errors.qualification?.message} htmlFor="qualification">
        <Input id="qualification" {...register('qualification')} error={errors.qualification?.message} />
      </FormField>
      <FormField label="الجامعة/المدرسة" required error={errors.school?.message} htmlFor="school">
        <Input id="school" {...register('school')} error={errors.school?.message} />
      </FormField>
      <FormField label="الرقم القومي" error={errors.personalCardNumber?.message} htmlFor="personalCardNumber">
        <Input id="personalCardNumber" className="ltr-numerals" {...register('personalCardNumber')} error={errors.personalCardNumber?.message} />
      </FormField>
      <FormField label="رقم الهاتف" required error={errors.phoneNumber?.message} htmlFor="phoneNumber">
        <Input id="phoneNumber" className="ltr-numerals" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
      </FormField>
      <FormField label="البريد الإلكتروني" error={errors.email?.message} htmlFor="email">
        <Input id="email" type="email" className="ltr-numerals" {...register('email')} error={errors.email?.message} />
      </FormField>
      <FormField label="تاريخ الميلاد" required error={errors.dateOfBirth?.message} htmlFor="dateOfBirth">
        <DatePicker id="dateOfBirth" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
      </FormField>
      <FormField label="العنوان" required error={errors.address?.message} htmlFor="address">
        <Input id="address" {...register('address')} error={errors.address?.message} />
      </FormField>
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

      <div className="col-span-full mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}