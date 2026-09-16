import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTeachersList, useCreateTeacher, useDeleteTeacher } from '../hooks/useTeachers';
import { TeacherForm } from '../components/TeacherForm';
import { TeacherDetailsModal } from '../components/TeacherDetailsModal';
import { TeacherEditModal } from '../components/TeacherEditModal';
import type { TeacherListDto } from '../types/teacher.types';
import type { AddTeacherFormValues } from '../types/teacher.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { GenderBadge } from '@/components/common/GenderBadge';
import type { Gender, Period } from '@/types/enums.types';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

const PAGE_SIZE = 10;

export function TeachersPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400) || undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<TeacherListDto | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useTeachersList(branchId ?? '', pageNumber, PAGE_SIZE, debouncedSearch);
  const createTeacher = useCreateTeacher(branchId ?? '');
  const deleteTeacher = useDeleteTeacher(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleFormSubmit = (values: AddTeacherFormValues) => {
    createTeacher.mutate(
      { ...values, gender: values.gender as Gender, period: values.period as Period, email: values.email || null },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  const columns: ColumnDef<TeacherListDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'levelName', header: 'المستوى', render: (row) => row.levelName || '—' },
    { key: 'className', header: 'الفصل', render: (row) => row.className || '—' },
    { key: 'phoneNumber', header: 'الهاتف', render: (row) => <span className="ltr-numerals">{row.phoneNumber}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">المعلمين</h1>
          <p className="text-sm text-neutral-500">إدارة معلمي الفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>إضافة معلم</Button>
      </div>

      <SearchInput value={searchInput} onChange={(v) => { setSearchInput(v); updateParams({ search: v, page: '1' }); }} placeholder="بحث باسم المعلم..." />

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          onRowClick={(row) => setViewingId(row.id)}

          emptyMessage="لا يوجد معلمين حاليًا"
          emptyActionLabel="إضافة معلم"
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة معلم جديد" size="lg">
        <TeacherForm branchId={branchId} onSubmit={handleFormSubmit} isLoading={createTeacher.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <TeacherDetailsModal branchId={branchId} teacherId={viewingId} onClose={() => setViewingId(null)} />

      <TeacherEditModal branchId={branchId} teacherId={editingId} onClose={() => setEditingId(null)} />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteTeacher.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف المعلم"
        message={`هل أنت متأكد أنك تريد حذف المعلم "${deleting?.name}"؟`}
        isLoading={deleteTeacher.isPending}
      />
    </div>
  );
}