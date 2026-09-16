import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAssessmentSchema, type AddAssessmentFormValues } from '../types/childAssessment.schema';
import { Input } from '@/components/forms/Input';
import { DatePicker } from '@/components/forms/DatePicker';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';

interface Props {
  childId: string;
  departmentId: string;
  onSubmit: (values: AddAssessmentFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

/** فورم تسجيل تقييم جديد للطالب في القسم المختار حاليًا */
export function ChildAssessmentForm({ childId, departmentId, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addAssessmentSchema),
    defaultValues: {
      childId,
      departmentId,
      currentLevel: '',
      progress: '',
      workbook: '',
      notes: '',
      assessmentDate: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as AddAssessmentFormValues))} className="flex flex-col gap-4" noValidate>
      <input type="hidden" {...register('childId')} value={childId} />
      <input type="hidden" {...register('departmentId')} value={departmentId} />

      <FormField label="تاريخ التقييم" required error={errors.assessmentDate?.message} htmlFor="assessmentDate">
        <DatePicker id="assessmentDate" {...register('assessmentDate')} error={errors.assessmentDate?.message} />
      </FormField>

      <FormField label="المستوى الحالي" required error={errors.currentLevel?.message} htmlFor="currentLevel">
        <Input id="currentLevel" {...register('currentLevel')} error={errors.currentLevel?.message} placeholder="مثال: المستوى الثاني" />
      </FormField>

      <FormField label="التقدم" error={errors.progress?.message} htmlFor="progress">
        <Input id="progress" {...register('progress')} error={errors.progress?.message} placeholder="مثال: جيد جدًا / 75%" />
      </FormField>

      <FormField label="الكراسة/المرجع" error={errors.workbook?.message} htmlFor="workbook">
        <Input id="workbook" {...register('workbook')} error={errors.workbook?.message} />
      </FormField>

      <FormField label="الصفحة الوصل إليها" error={errors.pageReached?.message} htmlFor="pageReached">
        <Input id="pageReached" type="number" className="ltr-numerals" {...register('pageReached')} error={errors.pageReached?.message} />
      </FormField>

      <FormField label="ملاحظات المعلم" error={errors.notes?.message} htmlFor="notes">
        <Input id="notes" {...register('notes')} error={errors.notes?.message} />
      </FormField>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ التقييم</Button>
      </div>
    </form>
  );
}
