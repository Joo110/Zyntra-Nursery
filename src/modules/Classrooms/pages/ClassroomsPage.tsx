import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useClassroomsList, useCreateClassroom, useUpdateClassroom, useDeleteClassroom } from '../hooks/useClassrooms';
import { ClassroomForm } from '../components/ClassroomForm';
import type { ClassMenuDto } from '../types/classroom.types';
import type { AddClassroomFormValues } from '../types/classroom.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function ClassroomsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClassMenuDto | null>(null);
  const [deleting, setDeleting] = useState<ClassMenuDto | null>(null);

  const { data, isLoading, isError } = useClassroomsList(branchId ?? '', pageNumber, PAGE_SIZE);
  const createClassroom = useCreateClassroom(branchId ?? '');
  const updateClassroom = useUpdateClassroom(branchId ?? '');
  const deleteClassroom = useDeleteClassroom(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const handleFormSubmit = (values: AddClassroomFormValues) => {
    if (editing) updateClassroom.mutate({ id: editing.id, ...values }, { onSuccess: () => setIsFormOpen(false) });
    else createClassroom.mutate(values, { onSuccess: () => setIsFormOpen(false) });
  };

  const columns: ColumnDef<ClassMenuDto>[] = [
    { key: 'class', header: 'اسم الفصل' },
    { key: 'teacherName', header: 'المعلم المسؤول', render: (row) => row.teacherName || '—' },
    { key: 'totalKids', header: 'عدد الطلاب', render: (row) => <span className="ltr-numerals">{row.totalKids}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الفصول</h1>
          <p className="text-sm text-neutral-500">إدارة فصول الفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>إضافة فصل</Button>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد فصول حاليًا"
          emptyActionLabel="إضافة فصل"
          onEmptyAction={() => { setEditing(null); setIsFormOpen(true); }}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditing(row); setIsFormOpen(true); }} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}
        />
        {data && (
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={handlePageChange} />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل الفصل' : 'إضافة فصل جديد'}>
        <ClassroomForm initialData={editing ?? undefined} onSubmit={handleFormSubmit} isLoading={createClassroom.isPending || updateClassroom.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteClassroom.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف الفصل"
        message={`هل أنت متأكد أنك تريد حذف فصل "${deleting?.class}"؟`}
        isLoading={deleteClassroom.isPending}
      />
    </div>
  );
}
