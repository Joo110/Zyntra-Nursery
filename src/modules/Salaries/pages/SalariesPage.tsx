import { useEffect, useRef, useState } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { useSalariesList, useDeleteSalary, useCreateSalary } from '../hooks/useSalaries';
import { useGenerateMonthlySalaries, type LoadEmployees } from '../hooks/useAutoGenerateSalaries';
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
import type { PagedResult } from '@/types/pagination.types';
import { teacherService } from '@/modules/Teachers/services/teacherService';
import { workerService } from '@/modules/Workers/services/workerService';

const EMP_TAKE = 100;

async function fetchAllPages<T>(fetchPage: (page: number) => Promise<PagedResult<T>>): Promise<T[]> {
  const first = await fetchPage(1);
  const all = [...(first.items ?? [])];
  for (let p = 2; p <= (first.totalPages ?? 1); p++) {
    all.push(...((await fetchPage(p)).items ?? []));
  }
  return all;
}

export function SalariesPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [type, setType] = useState<MemberType>(MemberType.Teacher);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<EmployeeSalaryDto | null>(null);
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);

  const { data, isLoading, isError } = useSalariesList(branchId ?? '', type);
  const createSalary = useCreateSalary(branchId ?? '');
  const deleteSalary = useDeleteSalary(branchId ?? '');

  // ── الإنزال التلقائي لرواتب الشهر ──
  const loadEmployees: LoadEmployees = async (t) => {
    if (!branchId) return [];
    if (t === MemberType.Teacher) {
      return fetchAllPages((p) => teacherService.getList(branchId, p, EMP_TAKE));
    }
    if (t === MemberType.Worker) {
      return fetchAllPages((p) => workerService.getList(branchId, p, EMP_TAKE));
    }
    return [];
  };

  const generate = useGenerateMonthlySalaries(branchId ?? '', loadEmployees);
  const autoRan = useRef(false);

  useEffect(() => {
    if (!branchId || autoRan.current) return;
    const now = new Date();
    const flagKey = `salaries-generated:${branchId}:${now.getFullYear()}-${now.getMonth() + 1}`;
    if (localStorage.getItem(flagKey)) return; // اتعمل الشهر ده من الجهاز ده
    autoRan.current = true;
    generate.mutate(undefined, {
      onSuccess: ({ total, failed }) => {
        // مش بنحفظ العلامة لو مفيش موظفين أو لو فيه فشل، عشان يحاول تاني
        if (total > 0 && failed === 0) localStorage.setItem(flagKey, '1');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

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
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
          >
            {generate.isPending ? 'جاري الإنزال...' : 'إنزال رواتب الشهر'}
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            إضافة راتب
          </Button>
        </div>
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