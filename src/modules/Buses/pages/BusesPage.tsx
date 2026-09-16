import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Bus as BusIcon } from 'lucide-react';
import { useBusesList, useCreateBus, useUpdateBus, useDeleteBus } from '../hooks/useBuses';
import { BusForm } from '../components/BusForm';
import type { BusListDto } from '../types/bus.types';
import type { AddBusFormValues } from '../types/bus.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function BusesPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400) || undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<BusListDto | null>(null);
  const [deleting, setDeleting] = useState<BusListDto | null>(null);

  const { data, isLoading, isError } = useBusesList(branchId ?? '', pageNumber, PAGE_SIZE, debouncedSearch);
  const createBus = useCreateBus(branchId ?? '');
  const updateBus = useUpdateBus(branchId ?? '');
  const deleteBus = useDeleteBus(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set('search', value);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFormSubmit = (values: AddBusFormValues) => {
    if (editing) {
      updateBus.mutate({ id: editing.id, ...values }, { onSuccess: () => setIsFormOpen(false) });
    } else {
      createBus.mutate({ branchId, ...values }, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const columns: ColumnDef<BusListDto>[] = [
    { key: 'name', header: 'اسم الباص' },
    { key: 'subFees', header: 'رسوم الاشتراك', render: (row) => <span className="ltr-numerals">{row.subFees.toLocaleString('ar-EG')} ج.م</span> },
    { key: 'capacity', header: 'السعة', render: (row) => <span className="ltr-numerals">{row.capacity}</span> },
    { key: 'driverName', header: 'السائق', render: (row) => row.driverName ?? '—' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><BusIcon className="h-5 w-5" /> الباصات</h1>
          <p className="text-sm text-neutral-500">إدارة باصات نقل الطلاب وربطهم بالسائقين</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>
          إضافة باص
        </Button>
      </div>

      <SearchInput value={searchInput} onChange={handleSearchChange} placeholder="بحث باسم الباص..." />

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد باصات حاليًا"
          emptyActionLabel="إضافة باص"
          onEmptyAction={() => { setEditing(null); setIsFormOpen(true); }}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditing(row); setIsFormOpen(true); }} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary" aria-label="تعديل">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف">
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل الباص' : 'إضافة باص جديد'}>
        <BusForm
          branchId={branchId}
          initialData={editing ?? undefined}
          onSubmit={handleFormSubmit}
          isLoading={createBus.isPending || updateBus.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteBus.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف الباص"
        message={`هل أنت متأكد أنك تريد حذف باص "${deleting?.name}"؟`}
        isLoading={deleteBus.isPending}
      />
    </div>
  );
}
