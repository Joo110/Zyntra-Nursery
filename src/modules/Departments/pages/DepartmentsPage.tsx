import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useDepartmentsList,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '../hooks/useDepartments';
import { DepartmentForm } from '../components/DepartmentForm';
import type { DepartmentListDto } from '../types/department.types';
import type { AddDepartmentFormValues } from '../types/department.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function DepartmentsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400) || undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentListDto | null>(null);
  const [deleting, setDeleting] = useState<DepartmentListDto | null>(null);

  const { data, isLoading, isError } = useDepartmentsList(
    branchId ?? '',
    pageNumber,
    PAGE_SIZE,
    debouncedSearch
  );
  const createDepartment = useCreateDepartment(branchId ?? '');
  const updateDepartment = useUpdateDepartment(branchId ?? '');
  const deleteDepartment = useDeleteDepartment(branchId ?? '');

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

  const handleFormSubmit = (values: AddDepartmentFormValues) => {
    if (editing) {
      updateDepartment.mutate({ id: editing.id, ...values }, { onSuccess: () => setIsFormOpen(false) });
    } else {
      createDepartment.mutate(values, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const columns: ColumnDef<DepartmentListDto>[] = [
    { key: 'departmentName', header: 'اسم القسم' },
    {
      key: 'subscriptionPrice',
      header: 'سعر الاشتراك',
      render: (row) => <span className="ltr-numerals">{row.subscriptionPrice.toLocaleString('ar-EG')} ج.م</span>,
    },
    { key: 'studentCount', header: 'عدد الطلاب', render: (row) => <span className="ltr-numerals">{row.studentCount}</span> },
    { key: 'isActive', header: 'الحالة', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الأقسام</h1>
          <p className="text-sm text-neutral-500">إدارة أقسام الحضانة بالفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>
          إضافة قسم
        </Button>
      </div>

      <SearchInput value={searchInput} onChange={handleSearchChange} placeholder="بحث باسم القسم..." />

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد أقسام حاليًا"
          emptyActionLabel="إضافة قسم"
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل القسم' : 'إضافة قسم جديد'}>
        <DepartmentForm
          initialData={editing ?? undefined}
          onSubmit={handleFormSubmit}
          isLoading={createDepartment.isPending || updateDepartment.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteDepartment.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف القسم"
        message={`هل أنت متأكد أنك تريد حذف قسم "${deleting?.departmentName}"؟`}
        isLoading={deleteDepartment.isPending}
      />
    </div>
  );
}
