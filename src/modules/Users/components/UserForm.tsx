import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addUserSchema, type AddUserFormValues } from '../types/user.schema';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Gender, GenderLabels, UserRole, UserRoleLabels } from '@/types/enums.types';

interface Props {
  onSubmit: (values: AddUserFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: UserRole.Staff, gender: Gender.male },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as AddUserFormValues))} className="flex flex-col gap-4" noValidate>
      <FormField label="الاسم" required error={errors.name?.message} htmlFor="name">
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </FormField>
      <FormField label="اسم المستخدم" required error={errors.userName?.message} htmlFor="userName">
        <Input id="userName" className="ltr-numerals" {...register('userName')} error={errors.userName?.message} />
      </FormField>
      <FormField label="كلمة المرور" required error={errors.password?.message} htmlFor="password">
        <Input id="password" type="password" {...register('password')} error={errors.password?.message} />
      </FormField>
      <FormField label="الدور الوظيفي" required htmlFor="role">
        <Select id="role" {...register('role')}>
          {Object.values(UserRole).filter((v) => typeof v === 'number').map((r) => (
            <option key={r} value={r}>{UserRoleLabels[r as UserRole]}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="النوع" required htmlFor="gender">
        <Select id="gender" {...register('gender')}>
          <option value={Gender.male}>{GenderLabels[Gender.male]}</option>
          <option value={Gender.female}>{GenderLabels[Gender.female]}</option>
        </Select>
      </FormField>
      <FormField label="المسمى الوظيفي" error={errors.jopName?.message} htmlFor="jopName">
        <Input id="jopName" {...register('jopName')} error={errors.jopName?.message} />
      </FormField>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>إلغاء</Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>حفظ</Button>
      </div>
    </form>
  );
}
