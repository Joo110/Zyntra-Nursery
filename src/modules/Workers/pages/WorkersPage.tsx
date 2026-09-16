import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useWorkersList, useCreateWorker, useDeleteWorker } from '../hooks/useWorkers';
import { WorkerForm } from '../components/WorkerForm';
import { WorkerDetailsModal } from '../components/WorkerDetailsModal';
import { WorkerEditModal } from '../components/WorkerEditModal';
import type { WorkerListDto } from '../types/worker.types';
import type { AddWorkerFormValues } from '../types/worker.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { GenderBadge } from '@/components/common/GenderBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import type { Gender, Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

export function WorkersPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400) || undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<WorkerListDto | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useWorkersList(branchId ?? '', pageNumber, PAGE_SIZE, debouncedSearch);
  const createWorker = useCreateWorker(branchId ?? '');
  const deleteWorker = useDeleteWorker(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<WorkerListDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'period', header: 'الفترة' },
    { key: 'phone', header: 'الهاتف', render: (row) => <span className="ltr-numerals">{row.phone}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">العمال</h1>
          <p className="text-sm text-neutral-500">إدارة عمال الفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>إضافة عامل</Button>
      </div>

      <SearchInput value={searchInput} onChange={(v) => { setSearchInput(v); updateParams({ search: v, page: '1' }); }} placeholder="بحث بالاسم..." />

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          onRowClick={(row) => setViewingId(row.id)}
          emptyMessage="لا يوجد عمال حاليًا"
          emptyActionLabel="إضافة عامل"
          onEmptyAction={() => setIsFormOpen(true)}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setEditingId(row.id); }}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary"
                aria-label="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleting(row); }}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger"
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
        {data && (
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة عامل جديد">
        <WorkerForm
          onSubmit={(values: AddWorkerFormValues) =>
            createWorker.mutate(
              { ...values, gender: values.gender as Gender, period: values.period as Period },
              { onSuccess: () => setIsFormOpen(false) }
            )
          }
          isLoading={createWorker.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <WorkerDetailsModal branchId={branchId} workerId={viewingId} onClose={() => setViewingId(null)} />

      <WorkerEditModal branchId={branchId} workerId={editingId} onClose={() => setEditingId(null)} />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteWorker.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف العامل"
        message={`هل أنت متأكد أنك تريد حذف "${deleting?.name}"؟`}
        isLoading={deleteWorker.isPending}
      />
    </div>
  );
}