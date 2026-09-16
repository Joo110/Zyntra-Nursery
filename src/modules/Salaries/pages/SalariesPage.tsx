import { useState } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { useSalariesList, useDeleteSalary, useCreateSalary } from '../hooks/useSalaries';
import { SalaryForm } from '../components/SalaryForm';
import { SalaryReceiptModal } from '../components/SalaryReceiptModal';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { MemberType, MemberTypeLabels } from '../types/enums.types';
import type { EmployeeSalaryDto } from '../types/salary.types';
import type { AddSalaryFormValues } from '../types/salary.schema';

export function SalariesPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [type, setType] = useState<MemberType>(MemberType.Teacher);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<EmployeeSalaryDto | null>(null);
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);

  const { data, isLoading, isError } = useSalariesList(branchId ?? '', type);
  const createSalary = useCreateSalary(branchId ?? '');
  const deleteSalary = useDeleteSalary(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

const handleFormSubmit = (values: AddSalaryFormValues) => {
  createSalary.mutate(
    { ...values, branchId },
    { onSuccess: () => setIsFormOpen(false) }
  );
};
  const columns: ColumnDef<EmployeeSalaryDto>[] = [
    { key: 'employeeName', header: 'الاسم', render: (row) => row.employeeName ?? '—' },
    {
      key: 'amount',
      header: 'المبلغ',
      render: (row) => <span className="ltr-numerals">{row.amount.toLocaleString('ar-EG')}</span>,
    },
    {
      key: 'salaryMonth',
      header: 'الشهر',
      render: (row) =>
        new Date(row.salaryMonth).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الرواتب</h1>
          <p className="text-sm text-neutral-500">إدارة رواتب المعلمين والعاملين</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
          إضافة راتب
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {(Object.values(MemberType) as MemberType[])
          .filter((t) => t !== MemberType.Child)
          .map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                type === t
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {MemberTypeLabels[t]}
            </button>
          ))}
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        getRowId={(row) => row.id}
        onRowClick={(row) => setViewingReceiptId(row.id)}
        emptyMessage="لا توجد رواتب مسجلة حاليًا"
        emptyActionLabel="إضافة راتب"
        onEmptyAction={() => setIsFormOpen(true)}
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewingReceiptId(row.id);
              }}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary"
              aria-label="عرض الوصل"
            >
              <Receipt className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleting(row);
              }}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger"
              aria-label="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة راتب جديد" size="lg">
        <SalaryForm
          branchId={branchId}
          onSubmit={handleFormSubmit}
          isLoading={createSalary.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <SalaryReceiptModal branchId={branchId} salaryId={viewingReceiptId} onClose={() => setViewingReceiptId(null)} />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteSalary.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف الراتب"
        message={`هل أنت متأكد أنك تريد حذف راتب "${deleting?.employeeName}"؟`}
        isLoading={deleteSalary.isPending}
      />
    </div>
  );
}