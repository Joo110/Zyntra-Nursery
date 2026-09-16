import { Modal } from '@/components/modals/Modal';
import { TeacherForm } from './TeacherForm';
import { useTeacher, useUpdateTeacher } from '../hooks/useTeachers';
import type { AddTeacherFormValues } from '../types/teacher.schema';
import type { Gender, Period } from '@/types/enums.types';
import { PageLoader } from '@/components/loading/PageLoader';

interface Props {
  branchId: string;
  teacherId: string | null;
  onClose: () => void;
}

export function TeacherEditModal({ branchId, teacherId, onClose }: Props) {
  const { data: teacher, isLoading } = useTeacher(branchId, teacherId ?? undefined);
  const updateTeacher = useUpdateTeacher(branchId);

  const handleSubmit = (values: AddTeacherFormValues) => {
    if (!teacherId) return;
    updateTeacher.mutate(
      {
        id: teacherId,
        name: values.name,
        qualification: values.qualification,
        school: values.school,
        personalCardNumber: values.personalCardNumber,
        email: values.email || null,
        phoneNumber: values.phoneNumber,
        dateOfBirth: values.dateOfBirth,
        address: values.address,
        levelId: values.levelId,
        classId: values.classId,
        gender: values.gender as Gender,
        period: values.period as Period,
        salary: values.salary,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={!!teacherId} onClose={onClose} title="تعديل بيانات المعلم" size="lg">
      {isLoading || !teacher ? (
        <PageLoader label="جاري تحميل بيانات المعلم..." />
      ) : (
        <TeacherForm
          branchId={branchId}
          initialData={{
            name: teacher.name,
            qualification: teacher.qualification,
            school: teacher.school,
            personalCardNumber: teacher.personalCardNumber,
            email: teacher.email ?? '',
            phoneNumber: teacher.phoneNumber,
            dateOfBirth: teacher.dateOfBirth.slice(0, 10),
            address: teacher.address,
            levelId: teacher.levelId,
            classId: teacher.classId,
            gender: teacher.gender,
            period: teacher.period,
            salary: teacher.salary,
          }}
          onSubmit={handleSubmit}
          isLoading={updateTeacher.isPending}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}