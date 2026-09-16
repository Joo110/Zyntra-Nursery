import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useLevelsList, useCreateLevel, useUpdateLevel, useDeleteLevel } from '../hooks/useLevels';
import { LevelForm } from '../components/LevelForm';
import type { LevelDto } from '../types/level.types';
import type { AddLevelFormValues } from '../types/level.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function LevelsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<LevelDto | null>(null);
  const [deleting, setDeleting] = useState<LevelDto | null>(null);

  const { data, isLoading, isError } = useLevelsList(branchId ?? '', pageNumber, PAGE_SIZE);
  const createLevel = useCreateLevel(branchId ?? '');
  const updateLevel = useUpdateLevel(branchId ?? '');
  const deleteLevel = useDeleteLevel(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const handleFormSubmit = (values: AddLevelFormValues) => {
    if (editing) updateLevel.mutate({ id: editing.id, ...values }, { onSuccess: () => setIsFormOpen(false) });
    else createLevel.mutate(values, { onSuccess: () => setIsFormOpen(false) });
  };

  const columns: ColumnDef<LevelDto>[] = [
    { key: 'levelName', header: 'اسم المستوى' },
    { key: 'levelContent', header: 'المحتوى', render: (row) => row.levelContent || '—' },
    { key: 'totalKids', header: 'عدد الطلاب', render: (row) => <span className="ltr-numerals">{row.totalKids}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">المستويات</h1>
          <p className="text-sm text-neutral-500">إدارة المستويات الدراسية بالفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>إضافة مستوى</Button>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد مستويات حاليًا"
          emptyActionLabel="إضافة مستوى"
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل المستوى' : 'إضافة مستوى جديد'}>
        <LevelForm initialData={editing ?? undefined} onSubmit={handleFormSubmit} isLoading={createLevel.isPending || updateLevel.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteLevel.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف المستوى"
        message={`هل أنت متأكد أنك تريد حذف مستوى "${deleting?.levelName}"؟`}
        isLoading={deleteLevel.isPending}
      />
    </div>
  );
}
