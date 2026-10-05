import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wallet, Users, Banknote, HandCoins } from 'lucide-react';
import { toast } from 'sonner';
import {
  useUnpaidSubscriptions,
  useUpdateSubscription,
  useDepartmentSubscriptionSummary,
} from '../hooks/useSubscriptions';
import { useGenerateMonthlySubscriptions } from '../hooks/useAutoGenerateSubscriptions';
import { PeriodSelector } from '../components/PeriodSelector';
import { PayModal } from '../components/PayModal';
import { PaymentHistoryTab } from '../components/PaymentHistoryTab';
import type { PaymentSubscriptionInfoDto, UpdateSubscriptionDto } from '../types/subscription.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { GenderBadge } from '@/components/common/GenderBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

/** المكان الوحيد اللي بنقرأ منه id الاشتراك. عدّله هنا لو الحقل اسمه مختلف. */
function getSubscriptionId(row: PaymentSubscriptionInfoDto | null): string | null {
  if (!row) return null;
  const r = row as PaymentSubscriptionInfoDto & { id?: string };
  return r.subscriptionId ?? r.id ?? null;
}

export function SubscriptionsPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? Period.AM) as Period;
  const [payingRow, setPayingRow] = useState<PaymentSubscriptionInfoDto | null>(null);
  const [tab, setTab] = useState<'unpaid' | 'history'>('unpaid');

  const { data, isLoading, isError } = useUnpaidSubscriptions(
    branchId ?? '',
    period,
    pageNumber,
    PAGE_SIZE,
    departmentId || undefined
  );
  const { data: summary, isLoading: isSummaryLoading } = useDepartmentSubscriptionSummary(
    branchId ?? '',
    departmentId,
    period
  );
  const updateSubscription = useUpdateSubscription(branchId ?? '');

  // ── الإنزال التلقائي لاشتراكات الشهر ──
  const generate = useGenerateMonthlySubscriptions(branchId ?? '');
  const autoRan = useRef(false);

  useEffect(() => {
    if (!branchId || autoRan.current) return;
    const now = new Date();
    const flagKey = `subs-generated:${branchId}:${now.getFullYear()}-${now.getMonth() + 1}`;
    if (localStorage.getItem(flagKey)) return;
    autoRan.current = true;
    generate.mutate(undefined, {
      onSuccess: ({ total, failed }) => {
        if (total > 0 && failed === 0) localStorage.setItem(flagKey, '1');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    if (!('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  const openPay = (row: PaymentSubscriptionInfoDto) => {
    if (!getSubscriptionId(row)) {
      toast.error('الـ API لا يرجّع subscriptionId، لا يمكن تعديل هذا الاشتراك');
      return;
    }
    setPayingRow(row);
  };

  const handlePayConfirm = (dto: UpdateSubscriptionDto) => {
    updateSubscription.mutate(dto, { onSuccess: () => setPayingRow(null) });
  };

  const columns: ColumnDef<PaymentSubscriptionInfoDto>[] = [
    { key: 'name', header: 'اسم الطالب' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    {
      key: 'amount',
      header: 'المبلغ المتبقي',
      render: (row) => <span className="ltr-numerals">{row.amount.toLocaleString('ar-EG')} ج.م</span>,
    },
    { key: 'status', header: 'الحالة', render: () => <StatusBadge status="unpaid" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Wallet className="h-5 w-5" /> الاشتراكات
          </h1>
          <p className="text-sm text-neutral-500">
            متابعة اشتراكات الطلاب غير المدفوعة، والدفع أو تعديل المبلغ المتبقي من خلال الصف
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-200">
        {([
          ['unpaid', 'غير المدفوعة'],
          ['history', 'سجل المدفوعات'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'history' ? (
        <PaymentHistoryTab />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full max-w-xs">
              <DepartmentSelector
                branchId={branchId}
                value={departmentId}
                onChange={(v) => updateParams({ departmentId: v })}
              />
            </div>
            <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p) })} />
          </div>

          {departmentId && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              {isSummaryLoading ? (
                <p className="text-sm text-neutral-500">جاري تحميل ملخص القسم...</p>
              ) : summary ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-neutral-500">عدد الطلاب</p>
                        <p className="text-lg font-bold text-neutral-900 ltr-numerals">
                          {summary.studentsCount.toLocaleString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                      <Banknote className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-neutral-500">إجمالي المتبقي</p>
                        <p className="text-lg font-bold text-neutral-900 ltr-numerals">
                          {summary.totalAmount.toLocaleString('ar-EG')} ج.م
                        </p>
                      </div>
                    </div>
                  </div>

                  {summary.students.length > 0 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-semibold text-neutral-700">
                        أسماء طلاب القسم ({summary.students.length.toLocaleString('ar-EG')})
                      </summary>
                      <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                        {summary.students.map((s) => (
                          <li key={s.id} className="rounded-md bg-neutral-50 px-2 py-1 text-neutral-700">
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">تعذّر تحميل ملخص القسم</p>
              )}
            </div>
          )}

          <div>
            <DataTable
              columns={columns}
              data={data?.items ?? []}
              isLoading={isLoading}
              isError={isError}
              getRowId={(row, i) => `${row.code}-${i}`}
              emptyMessage="لا يوجد اشتراكات غير مدفوعة حاليًا"
              rowActions={(row) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPay(row);
                  }}
                  className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  aria-label="دفع أو تعديل المبلغ المتبقي"
                >
                  <HandCoins className="h-4 w-4" /> دفع / تعديل المتبقي
                </button>
              )}
            />
            {data && (
              <Pagination
                pageNumber={data.pageNumber}
                totalPages={data.totalPages}
                hasNextPage={data.hasNextPage}
                hasPreviousPage={data.hasPreviousPage}
                totalCount={data.totalCount}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            )}
          </div>
        </>
      )}

      <PayModal
        row={payingRow}
        subscriptionId={getSubscriptionId(payingRow)}
        isLoading={updateSubscription.isPending}
        onClose={() => setPayingRow(null)}
        onConfirm={handlePayConfirm}
      />
    </div>
  );
}