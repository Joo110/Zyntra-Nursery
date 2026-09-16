import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useBranchesList,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from '../hooks/useBranches';
import { BranchForm } from '../components/BranchForm';
import type { BranchListDto } from '../types/branch.types';
import type { AddBranchFormValues } from '../types/branch.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 10;

/**
 * Proof of Concept — أول Module يتم تنفيذه بالكامل لإثبات صحة التكامل:
 * Axios + Types + Service + Hook + TanStack Query + Pagination + Validation +
 * Error Handling + Toast + RTL UI (راجع 07-Frontend-Implementation-Plan.md § Stage 1).
 */
export function BranchesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const searchTerm = searchParams.get('search') ?? '';

  const [searchInput, setSearchInput] = useState(searchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchListDto | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<BranchListDto | null>(null);

  // مزامنة البحث مع الـ URL بعد الـ Debounce (راجع Master Prompt § 14 URL State)
  const effectiveSearch = debouncedSearch || undefined;

  const { data, isLoading, isError } = useBranchesList(pageNumber, PAGE_SIZE, effectiveSearch);

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deleteBranch = useDeleteBranch();

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

  const openCreateForm = () => {
    setEditingBranch(null);
    setIsFormOpen(true);
  };

  const openEditForm = (branch: BranchListDto) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: AddBranchFormValues) => {
    if (editingBranch) {
      updateBranch.mutate(
        { id: editingBranch.id, ...values },
        { onSuccess: () => setIsFormOpen(false) }
      );
    } else {
      createBranch.mutate(values, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingBranch) return;
    deleteBranch.mutate(deletingBranch.id, { onSuccess: () => setDeletingBranch(null) });
  };

  const columns: ColumnDef<BranchListDto>[] = [
    { key: 'branchName', header: 'اسم الفرع' },
    { key: 'address', header: 'العنوان', render: (row) => row.address || '—' },
    {
      key: 'phone',
      header: 'رقم الهاتف',
      render: (row) => <span className="ltr-numerals">{row.phone || '—'}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الفروع</h1>
          <p className="text-sm text-neutral-500">إدارة فروع الحضانة</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreateForm}>
          إضافة فرع
        </Button>
      </div>

      <SearchInput value={searchInput} onChange={handleSearchChange} placeholder="بحث باسم الفرع..." />

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد فروع حاليًا"
          emptyActionLabel="إضافة فرع"
          onEmptyAction={openCreateForm}
          rowActions={(row) => (
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditForm(row)}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary"
                aria-label="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingBranch(row)}
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

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
      >
        <BranchForm
          initialData={editingBranch ?? undefined}
          onSubmit={handleFormSubmit}
          isLoading={createBranch.isPending || updateBranch.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingBranch}
        onClose={() => setDeletingBranch(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف الفرع"
        message={`هل أنت متأكد أنك تريد حذف فرع "${deletingBranch?.branchName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        isLoading={deleteBranch.isPending}
      />
    </div>
  );
}
