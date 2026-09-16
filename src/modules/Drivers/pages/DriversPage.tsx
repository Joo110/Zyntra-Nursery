import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Pencil, UserCog } from 'lucide-react';
import { useDriversList, useCreateDriver, useUpdateDriver, useDeleteDriver } from '../hooks/useDrivers';
import { DriverForm } from '../Components/DriverForm';
import type { DriverListDto } from '../types/driver.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function DriversPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<DriverListDto | null>(null);
  const [deleting, setDeleting] = useState<DriverListDto | null>(null);

  const { data, isLoading, isError } = useDriversList(branchId ?? '', pageNumber, PAGE_SIZE);
  const createDriver = useCreateDriver(branchId ?? '');
  const updateDriver = useUpdateDriver(branchId ?? '');
  const deleteDriver = useDeleteDriver(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const handleAddSubmit = (values: { name: string; phoneNumber: string; isSmoking: boolean }) => {
    createDriver.mutate({ branchId, ...values }, { onSuccess: () => setIsFormOpen(false) });
  };

  const handleEditSubmit = (values: { name: string; phoneNumber: string; isSmoking: boolean }) => {
    if (!editing) return;
    updateDriver.mutate({ id: editing.id, ...values }, { onSuccess: () => setEditing(null) });
  };

  const columns: ColumnDef<DriverListDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'phoneNumber', header: 'الهاتف', render: (row) => <span className="ltr-numerals">{row.phoneNumber}</span> },
    { key: 'isSmoking', header: 'مدخن', render: (row) => (row.isSmoking ? 'نعم' : 'لا') },
    { key: 'branchName', header: 'الفرع' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <UserCog className="h-5 w-5" /> السائقين
          </h1>
          <p className="text-sm text-neutral-500">إدارة سائقي الباصات بالفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
          إضافة سائق
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد سائقين حاليًا"
          emptyActionLabel="إضافة سائق"
          onEmptyAction={() => setIsFormOpen(true)}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(row)}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary"
                aria-label="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleting(row)}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger"
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
        {data && (
          <Pagination
            pageNumber={data.pageNumber}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            totalCount={data.totalCount}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة سائق جديد">
        <DriverForm onSubmit={handleAddSubmit} isLoading={createDriver.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="تعديل بيانات السائق">
        {editing && (
          <DriverForm
            defaultValues={{ name: editing.name, phoneNumber: editing.phoneNumber, isSmoking: editing.isSmoking }}
            onSubmit={handleEditSubmit}
            isLoading={updateDriver.isPending}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteDriver.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف السائق"
        message={`هل أنت متأكد أنك تريد حذف السائق "${deleting?.name}"؟`}
        isLoading={deleteDriver.isPending}
      />
    </div>
  );
}