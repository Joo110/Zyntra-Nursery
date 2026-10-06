import { useEffect, useRef, useState } from 'react';
import { Receipt, Trash2, Wallet } from 'lucide-react';
import { useSalariesList, useDeleteSalary, usePaySalary } from '../hooks/useSalaries';
import { useGenerateMonthlySalaries, type LoadEmployees } from '../hooks/useAutoGenerateSalaries';
import { SalaryReceiptModal } from '../components/SalaryReceiptModal';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { MemberType, MemberTypeLabels } from '../types/enums.types';
import type { EmployeeSalaryDto } from '../types/salary.types';
import type { PagedResult } from '@/types/pagination.types';
import { teacherService } from '@/modules/Teachers/services/teacherService';
import { workerService } from '@/modules/Workers/services/workerService';
import { PayConfirmModal } from '../components/PayConfirmModal';

const EMP_TAKE = 100;

async function fetchAllPages<T>(fetchPage: (page: number) => Promise<PagedResult<T>>): Promise<T[]> {
  const first = await fetchPage(1);
  const all = [...(first.items ?? [])];
  for (let p = 2; p <= (first.totalPages ?? 1); p++) {
    all.push(...((await fetchPage(p)).items ?? []));
  }
  return all;
}

const fmt = (n: number) => `${(n ?? 0).toLocaleString('ar-EG')} ج.م`;

export function SalariesPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [type, setType] = useState<MemberType>(MemberType.Teacher);

  const [deleting, setDeleting] = useState<EmployeeSalaryDto | null>(null);
  const [paying, setPaying] = useState<EmployeeSalaryDto | null>(null);
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);

  const { data, isLoading, isError } = useSalariesList(branchId ?? '', type);
  const deleteSalary = useDeleteSalary(branchId ?? '');
  const paySalary = usePaySalary(branchId ?? '');

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
    if (localStorage.getItem(flagKey)) return;
    autoRan.current = true;
    generate.mutate(undefined, {
      onSuccess: ({ total, failed }) => {
        if (total > 0 && failed === 0) localStorage.setItem(flagKey, '1');
      },
    });
  }, [branchId]);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const columns: ColumnDef<EmployeeSalaryDto>[] = [
    { key: 'employeeName', header: 'الاسم', render: (row) => row.employeeName ?? '—' },
    {
      key: 'amount',
      header: 'المبلغ',
      render: (row) => <span className="ltr-numerals">{fmt(row.amount)}</span>,
    },
    {
      key: 'salaryMonth',
      header: 'الشهر',
      render: (row) =>
        new Date(row.salaryMonth).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
    },
    {
      key: 'isPaid',
      header: 'الحالة',
      render: (row) => (
        <span className={row.isPaid ? 'text-green-600' : 'text-red-600'}>
          {row.isPaid ? 'مدفوع' : 'غير مدفوع'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">الرواتب</h1>
        <p className="text-sm text-neutral-500">
          {generate.isPending ? 'جاري إنزال رواتب الشهر...' : 'إدارة رواتب المعلمين والعاملين'}
        </p>
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
        isLoading={isLoading || generate.isPending}
        isError={isError}
        getRowId={(row) => row.id}
        onRowClick={(row) => setViewingReceiptId(row.id)}
        emptyMessage="لا توجد رواتب مسجلة حاليًا"
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            {!row.isPaid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPaying(row);
                }}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-green-600"
                aria-label="دفع"
              >
                <Wallet className="h-4 w-4" />
              </button>
            )}
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

          <PayConfirmModal
        isOpen={!!paying}
        onClose={() => setPaying(null)}
        onConfirm={() =>
          paying && paySalary.mutate({ salary: paying, type }, { onSuccess: () => setPaying(null) })
        }
        message={`هل تريد تأكيد دفع راتب "${paying?.employeeName}" بمبلغ ${fmt(paying?.amount ?? 0)}؟`}
        isLoading={paySalary.isPending}
      />

      <SalaryReceiptModal
        branchId={branchId}
        salaryId={viewingReceiptId}
        onClose={() => setViewingReceiptId(null)}
      />

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