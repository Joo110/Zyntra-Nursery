import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useBrothersByChild, useCreateBrother, useUpdateBrother, useDeleteBrother } from '../hooks/useBrothers';
import { BrotherForm } from '../components/BrotherForm';
import type { BrotherListDto } from '../types/brother.types';
import type { AddBrotherFormValues } from '../types/brother.schema';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { ChildDropdown } from '@/components/common/ChildDropdown';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

/**
 * راجع BACKEND_ISSUES.md - Issue #4: Brother لا يحتوي branchId بالـ API، الربط فقط عبر ChildId.
 * لذا هذه الصفحة تطلب من المستخدم اختيار قسم ثم طالب أولًا لعرض إخوته.
 */
export function BrothersPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;
  const childId = searchParams.get('childId') ?? '';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<BrotherListDto | null>(null);
  const [deleting, setDeleting] = useState<BrotherListDto | null>(null);

  const { data: brothers, isLoading, isError } = useBrothersByChild(childId);
  const createBrother = useCreateBrother();
  const updateBrother = useUpdateBrother(childId);
  const deleteBrother = useDeleteBrother(childId);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleFormSubmit = (values: AddBrotherFormValues) => {
    if (editing) updateBrother.mutate({ id: editing.id, ...values }, { onSuccess: () => setIsFormOpen(false) });
    else createBrother.mutate({ ...values, childId }, { onSuccess: () => setIsFormOpen(false) });
  };

  const columns: ColumnDef<BrotherListDto>[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'dateOfBirth', header: 'تاريخ الميلاد', render: (row) => <span className="ltr-numerals">{row.dateOfBirth.slice(0, 10)}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><Users className="h-5 w-5" /> الإخوة</h1>
        <p className="text-sm text-neutral-500">إدارة إخوة الطالب المسجّلين بالحضانة</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, childId: '' })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), childId: '' })} />
        <div className="w-full max-w-xs">
          <ChildDropdown branchId={branchId} departmentId={departmentId} period={period} value={childId} onChange={(v) => updateParams({ childId: v })} />
        </div>
      </div>

      {!childId ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-surface p-10 text-center text-sm text-neutral-500">
          برجاء اختيار طالب لعرض إخوته
        </div>
      ) : (
        <>
          <div>
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setIsFormOpen(true); }}>إضافة أخ/أخت</Button>
          </div>
          <DataTable
            columns={columns}
            data={brothers ?? []}
            isLoading={isLoading}
            isError={isError}
            getRowId={(row) => row.id}
            emptyMessage="لا يوجد إخوة مسجلين لهذا الطالب"
            rowActions={(row) => (
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(row); setIsFormOpen(true); }} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary" aria-label="تعديل"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
              </div>
            )}
          />
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? 'تعديل بيانات' : 'إضافة أخ/أخت'}>
        <BrotherForm initialData={editing ?? undefined} onSubmit={handleFormSubmit} isLoading={createBrother.isPending || updateBrother.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteBrother.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف"
        message={`هل أنت متأكد أنك تريد حذف "${deleting?.name}"؟`}
        isLoading={deleteBrother.isPending}
      />
    </div>
  );
}
