import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { useGraduationList, useCreateGraduation, useUpdateGraduation, useDeleteGraduation } from '../hooks/useGraduation';
import { GraduationForm } from '../components/GraduationForm';
import type { GraduationDto } from '../types/graduation.types';
import type { AddGraduationFormValues } from '../types/graduation.schema';
import { Gender } from '@/types/enums.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { GenderBadge } from '@/components/common/GenderBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';

export function GraduationPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<GraduationDto | null>(null);
  const [deleting, setDeleting] = useState<GraduationDto | null>(null);

  const { data, isLoading, isError } = useGraduationList(branchId ?? '');
  const createGraduation = useCreateGraduation(branchId ?? '');
  const updateGraduation = useUpdateGraduation(branchId ?? '');
  const deleteGraduation = useDeleteGraduation(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const handleFormSubmit = (values: AddGraduationFormValues) => {
    const payload = { ...values, gender: values.gender as Gender };
    if (editing) updateGraduation.mutate({ id: editing.id, ...payload }, { onSuccess: () => setIsFormOpen(false) });
    else createGraduation.mutate(payload, { onSuccess: () => setIsFormOpen(false) });
  };

  const columns: ColumnDef<GraduationDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'dateOfJoin', header: 'تاريخ الالتحاق', render: (row) => <span className="ltr-numerals">{row.dateOfJoin.slice(0, 10)}</span> },
    { key: 'dateOfGraduation', header: 'تاريخ التخرج', render: (row) => <span className="ltr-numerals">{row.dateOfGraduation.slice(0, 10)}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><GraduationCap className="h-5 w-5" /> التخريج</h1>
          <p className="text-sm text-neutral-500">سجل الطلاب الخريجين بالفرع المختار</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>إضافة سجل تخريج</Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        getRowId={(row) => row.id}
        emptyMessage="لا يوجد سجلات تخريج حاليًا"
        emptyActionLabel="إضافة سجل"
        onEmptyAction={() => { setEditing(null); setIsFormOpen(true); }}
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => { setEditing(row); setIsFormOpen(true); }} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل السجل' : 'إضافة سجل تخريج'}>
        <GraduationForm initialData={editing ?? undefined} onSubmit={handleFormSubmit} isLoading={createGraduation.isPending || updateGraduation.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteGraduation.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف السجل"
        message={`هل أنت متأكد أنك تريد حذف سجل "${deleting?.name}"؟`}
        isLoading={deleteGraduation.isPending}
      />
    </div>
  );
}
