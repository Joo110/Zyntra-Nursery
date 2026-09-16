import { useState } from 'react';
import { Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { useUsersList, useCreateUser, useDeleteUser, useToggleUserActive } from '../hooks/useUsers';
import { UserForm } from '../components/UserForm';
import type { UserListDto } from '../types/user.types';
import type { AddUserFormValues } from '../types/user.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { UserRole, UserRoleLabels, Gender } from '@/types/enums.types';

export function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<UserListDto | null>(null);

  const { data, isLoading, isError } = useUsersList();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const toggleActive = useToggleUserActive();

  const handleSubmit = (values: AddUserFormValues) => {
    createUser.mutate(
      { ...values, role: values.role as UserRole, gender: values.gender as Gender, isActive: true },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  const columns: ColumnDef<UserListDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'userName', header: 'اسم المستخدم', render: (row) => <span className="ltr-numerals">{row.userName}</span> },
    { key: 'role', header: 'الدور', render: (row) => UserRoleLabels[row.role] },
    { key: 'isActive', header: 'الحالة', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <RoleGuard allow={[UserRole.Admin, UserRole.Manager]} fallback={<p className="text-sm text-neutral-500">ليس لديك صلاحية للوصول لهذه الصفحة.</p>}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">المستخدمين</h1>
            <p className="text-sm text-neutral-500">إدارة مستخدمي النظام وصلاحياتهم</p>
          </div>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>إضافة مستخدم</Button>
        </div>

        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد مستخدمين حاليًا"
          emptyActionLabel="إضافة مستخدم"
          onEmptyAction={() => setIsFormOpen(true)}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleActive.mutate({ userId: row.id, activate: !row.isActive })}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-secondary"
                aria-label={row.isActive ? 'تعطيل' : 'تفعيل'}
              >
                {row.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              </button>
              <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />

        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة مستخدم جديد">
          <UserForm onSubmit={handleSubmit} isLoading={createUser.isPending} onCancel={() => setIsFormOpen(false)} />
        </Modal>

        <ConfirmModal
          isOpen={!!deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => deleting && deleteUser.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
          title="حذف المستخدم"
          message={`هل أنت متأكد أنك تريد حذف المستخدم "${deleting?.name}"؟`}
          isLoading={deleteUser.isPending}
        />
      </div>
    </RoleGuard>
  );
}
