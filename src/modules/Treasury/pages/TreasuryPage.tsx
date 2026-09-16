import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Coins, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useTreasuryMonthly,
  useTreasuryMonthlyOrder,
  useTreasuryYearly,
  useTreasuryYearlyByMonth,
  useTreasuryYearlyByType,
  useTreasuryYearlyByTypeAndMonth,
  useAvailableMonths,
  useCreateTreasuryEntry,
  useMonthlyTreasuryReport,
  useDepartmentsTreasuryReport,
  useDepartmentTreasuryTotal,
  useDepartmentTreasuryByType,
} from '../hooks/useTreasury';
import { TreasuryForm } from '../components/TreasuryForm';
import { ManualTreasuryForm } from '../components/ManualTreasuryForm';
import type { AddTreasuryFormValues } from '../types/treasury.schema';
import type { ManualTreasuryFormValues } from '../types/manualTreasury.schema';
import type { TreasuryDataDto } from '../types/treasury.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/forms/Select';
import { Modal } from '@/components/modals/Modal';
import { useBranchStore } from '@/app/providers/branchStore';
import { useAuthStore } from '@/app/providers/authStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { MemberType, TrunsactionType } from '@/types/enums.types';

const PAGE_SIZE = 10;

/** غير مربوط بعضو (طفل/معلم/عامل) — يُستخدم لعمليات المصاريف/الإيرادات الجانبية اليدوية */
const MANUAL_ENTRY_MEMBER_TYPE = 0 as unknown as MemberType;
const MANUAL_ENTRY_MEMBER_ID = '00000000-0000-0000-0000-000000000000';

type ViewMode = 'monthly' | 'yearly';
type TransactionFilter = 'all' | TrunsactionType;

export function TreasuryPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const userId = useAuthStore((s) => s.user?.userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [isDeptReportOpen, setIsDeptReportOpen] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const now = new Date();

  // ---- شهور متاحة (GET /Treasury/months) — تُستخدم لملء قائمة اختيار الشهر في العرض السنوي
  const { data: availableMonths } = useAvailableMonths(branchId ?? '', departmentId || undefined);

  // ---- تقرير الخزنة الشهري (GET /Treasury/report/monthly)
  const { data: monthlyReport } = useMonthlyTreasuryReport(branchId ?? '', now.getFullYear(), now.getMonth() + 1);

  // ---- تقرير الأقسام (GET /Treasury/departments/report)
  const { data: deptReport } = useDepartmentsTreasuryReport(branchId ?? '');

  // ---- إجمالي وتصنيف خزينة القسم المختار (GET /Treasury/department/{id}/total, /by-type)
  const { data: deptTotal } = useDepartmentTreasuryTotal(branchId ?? '', departmentId);
  const { data: deptByType } = useDepartmentTreasuryByType(branchId ?? '', departmentId);

  // ---- الحركات الشهرية (GET /Treasury/monthly و /Treasury/monthly/order)
  const monthlyPlain = useTreasuryMonthly(branchId ?? '', pageNumber, PAGE_SIZE, undefined, departmentId || undefined);
  const monthlyByType = useTreasuryMonthlyOrder(
    branchId ?? '',
    transactionFilter === 'all' ? (undefined as unknown as TrunsactionType) : transactionFilter,
    pageNumber,
    PAGE_SIZE,
    undefined,
    departmentId || undefined
  );

  // ---- الحركات السنوية (GET /Treasury/yearly, /yearly/month, /yearly/type, /yearly/type/month)
  const yearlyGeneral = useTreasuryYearly(
    branchId ?? '',
    pageNumber,
    PAGE_SIZE,
    selectedMonth || undefined,
    selectedDay || undefined,
    transactionFilter === 'all' ? undefined : transactionFilter,
    departmentId || undefined
  );
  const yearlyByMonth = useTreasuryYearlyByMonth(
    branchId ?? '',
    selectedMonth,
    pageNumber,
    PAGE_SIZE,
    undefined,
    departmentId || undefined
  );
  const yearlyByType = useTreasuryYearlyByType(
    branchId ?? '',
    transactionFilter === 'all' ? (undefined as unknown as TrunsactionType) : transactionFilter,
    pageNumber,
    PAGE_SIZE,
    departmentId || undefined
  );
  const yearlyByTypeAndMonth = useTreasuryYearlyByTypeAndMonth(
    branchId ?? '',
    transactionFilter === 'all' ? (undefined as unknown as TrunsactionType) : transactionFilter,
    selectedMonth,
    selectedDay,
    pageNumber,
    PAGE_SIZE,
    departmentId || undefined
  );

  /**
   * اختيار الاستعلام النشط حسب الفلاتر المختارة، عشان نستخدم كل Endpoint في حالته
   * الصحيحة بدل ما نعتمد بس على /yearly العام لكل الحالات.
   */
  const activeQuery = useMemo(() => {
    if (viewMode === 'monthly') {
      return transactionFilter === 'all' ? monthlyPlain : monthlyByType;
    }
    // viewMode === 'yearly'
    if (transactionFilter !== 'all' && selectedMonth && selectedDay) return yearlyByTypeAndMonth;
    if (transactionFilter !== 'all' && !selectedMonth) return yearlyByType;
    if (selectedMonth && !selectedDay) return yearlyByMonth;
    return yearlyGeneral;
  }, [viewMode, transactionFilter, selectedMonth, selectedDay, monthlyPlain, monthlyByType, yearlyByTypeAndMonth, yearlyByType, yearlyByMonth, yearlyGeneral]);

  const { data, isLoading, isError } = activeQuery;

  const createEntry = useCreateTreasuryEntry(branchId ?? '');
  const createManualEntry = useCreateTreasuryEntry(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleSubmit = (values: AddTreasuryFormValues) => {
    if (!userId) return;
    createEntry.mutate(
      {
        amount: values.amount,
        trunsactionType: values.trunsactionType as TrunsactionType,
        memberId: values.memberId,
        memberType: MemberType.Child,
        userId,
        dateTime: new Date().toISOString(),
      },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  /**
   * عملية إيداع/سحب يدوي — تستخدم نفس Endpoint العام (POST /Treasury) بدون تحديد عضو حقيقي،
   * فيحسبها الباك تلقائيًا كـ AdditionalRevenue أو AdditionalExpenses (راجع TreasuryService.DetermineTreasuryKind).
   */
  const handleManualSubmit = (values: ManualTreasuryFormValues) => {
    if (!userId) return;
    createManualEntry.mutate(
      {
        amount: values.amount,
        trunsactionType: values.trunsactionType as TrunsactionType,
        memberId: MANUAL_ENTRY_MEMBER_ID,
        memberType: MANUAL_ENTRY_MEMBER_TYPE,
        userId,
        dateTime: new Date(values.dateTime).toISOString(),
      },
      { onSuccess: () => setIsManualFormOpen(false) }
    );
  };

  const columns: ColumnDef<TreasuryDataDto>[] = [
    { key: 'dateTime', header: 'التاريخ', render: (row) => <span className="ltr-numerals">{row.dateTime.slice(0, 10)}</span> },
    { key: 'kind', header: 'النوع' },
    { key: 'transaction', header: 'دخل/صرف' },
    { key: 'amount', header: 'المبلغ', render: (row) => <span className="ltr-numerals">{row.amount.toLocaleString('ar-EG')} ج.م</span> },
    { key: 'userName', header: 'بواسطة' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><Coins className="h-5 w-5" /> الخزينة</h1>
          <p className="text-sm text-neutral-500">الحركات المالية للفرع المختار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Wallet className="h-4 w-4" />} onClick={() => setIsManualFormOpen(true)}>
            إيداع / سحب يدوي
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>إضافة حركة مالية</Button>
        </div>
      </div>

      {monthlyReport && (
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard label="إجمالي الدخل" value={monthlyReport.totalIncome} tone="secondary" />
          <SummaryCard label="الرواتب المدفوعة" value={monthlyReport.totalSalariesPaid} tone="neutral" />
          <SummaryCard label="مصاريف إضافية" value={monthlyReport.totalAdditionalExpenses} tone="danger" />
          <SummaryCard label="صافي الأرباح" value={monthlyReport.profit} tone={monthlyReport.profit >= 0 ? 'secondary' : 'danger'} />
          <SummaryCard label="الرصيد المتبقي" value={monthlyReport.remainingBalance} tone="neutral" />
          <SummaryCard label="المتأخرات" value={monthlyReport.overdueAmounts} tone="warning" />
          <SummaryCard label="نسبة التحصيل" value={monthlyReport.collectionRatePercentage} suffix="%" tone="neutral" />
          <SummaryCard label="إجمالي المسحوبات" value={monthlyReport.totalWithdrawals} tone="danger" />
        </div>
      )}

      {/* فلاتر العرض */}
      <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-surface p-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-500">نوع العرض</label>
            <div className="flex overflow-hidden rounded-md border border-neutral-300">
              <button
                type="button"
                onClick={() => { setViewMode('monthly'); setSelectedMonth(''); setSelectedDay(''); updateParams({ page: '1' }); }}
                className={`px-3 py-1.5 text-sm ${viewMode === 'monthly' ? 'bg-primary text-white' : 'bg-white text-neutral-600'}`}
              >
                شهري
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('yearly'); updateParams({ page: '1' }); }}
                className={`px-3 py-1.5 text-sm ${viewMode === 'yearly' ? 'bg-primary text-white' : 'bg-white text-neutral-600'}`}
              >
                سنوي
              </button>
            </div>
          </div>

          <div className="flex w-40 flex-col gap-1">
            <label className="text-xs text-neutral-500">نوع الحركة</label>
            <Select
              value={transactionFilter === 'all' ? 'all' : String(transactionFilter)}
              onChange={(e) => {
                const v = e.target.value;
                setTransactionFilter(v === 'all' ? 'all' : (Number(v) as TrunsactionType));
                updateParams({ page: '1' });
              }}
            >
              <option value="all">الكل</option>
              <option value={TrunsactionType.Income}>دخل</option>
              <option value={TrunsactionType.Expenses}>صرف</option>
            </Select>
          </div>

          {viewMode === 'yearly' && (
            <>
              <div className="flex w-40 flex-col gap-1">
                <label className="text-xs text-neutral-500">الشهر</label>
                <Select
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setSelectedDay(''); updateParams({ page: '1' }); }}
                >
                  <option value="">كل الشهور</option>
                  {availableMonths?.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>

              {selectedMonth && (
                <div className="flex w-28 flex-col gap-1">
                  <label className="text-xs text-neutral-500">اليوم (اختياري)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    className="ltr-numerals rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                    value={selectedDay}
                    onChange={(e) => { setSelectedDay(e.target.value); updateParams({ page: '1' }); }}
                    placeholder="1-31"
                  />
                </div>
              )}
            </>
          )}

          <div className="w-full max-w-xs">
            <label className="text-xs text-neutral-500">القسم</label>
            <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, page: '1' })} />
          </div>
        </div>

        {/* إحصائيات القسم المختار (department/total + department/by-type) */}
        {departmentId && (deptTotal !== undefined || deptByType) && (
          <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-3">
            {deptTotal !== undefined && (
              <div className="rounded-md bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700">
                إجمالي خزينة القسم: <span className="ltr-numerals font-semibold">{deptTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
            )}
            {deptByType && Object.entries(deptByType).map(([type, total]) => (
              <div key={type} className="rounded-md bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700">
                {type}: <span className="ltr-numerals font-semibold">{total.toLocaleString('ar-EG')} ج.م</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* تقرير الأقسام (departments/report) */}
      <div className="rounded-lg border border-neutral-200 bg-surface">
        <button
          type="button"
          onClick={() => setIsDeptReportOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3 text-sm font-semibold text-neutral-700"
        >
          تقرير الأقسام (نسبة التحصيل)
          {isDeptReportOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {isDeptReportOpen && (
          <div className="overflow-x-auto border-t border-neutral-100 p-3">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-neutral-500">
                  <th className="p-2 text-right">القسم</th>
                  <th className="p-2 text-center">عدد الطلاب النشطين</th>
                  <th className="p-2 text-center">المتوقع تحصيله</th>
                  <th className="p-2 text-center">المحصّل</th>
                  <th className="p-2 text-center">نسبة التحصيل</th>
                </tr>
              </thead>
              <tbody>
                {deptReport?.map((d) => (
                  <tr key={d.departmentName} className="border-t border-neutral-100">
                    <td className="p-2 text-right">{d.departmentName}</td>
                    <td className="ltr-numerals p-2 text-center">{d.activeChildrenCount}</td>
                    <td className="ltr-numerals p-2 text-center">{d.expectedTotal.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م</td>
                    <td className="ltr-numerals p-2 text-center">{d.totalCollected.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م</td>
                    <td className="ltr-numerals p-2 text-center">{d.collectionPercentage.toFixed(1)}%</td>
                  </tr>
                ))}
                {!deptReport?.length && (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-neutral-400">لا توجد بيانات</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row, i) => `${row.dateTime}-${i}`}
          emptyMessage="لا يوجد حركات مالية بهذه الفلاتر"
        />
        {data && (
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="إضافة حركة مالية">
        <TreasuryForm branchId={branchId} departmentId={departmentId} onSubmit={handleSubmit} isLoading={createEntry.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={isManualFormOpen} onClose={() => setIsManualFormOpen(false)} title="إيداع / سحب يدوي (مصاريف جانبية)">
        <ManualTreasuryForm onSubmit={handleManualSubmit} isLoading={createManualEntry.isPending} onCancel={() => setIsManualFormOpen(false)} />
      </Modal>
    </div>
  );
}

function SummaryCard({ label, value, suffix, tone }: { label: string; value: number; suffix?: string; tone: 'secondary' | 'danger' | 'warning' | 'neutral' }) {
  const toneClasses: Record<string, string> = {
    secondary: 'text-secondary',
    danger: 'text-danger',
    warning: 'text-warning',
    neutral: 'text-neutral-800',
  };
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-surface p-4 shadow-sm">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className={`ltr-numerals text-xl font-bold leading-none ${toneClasses[tone]}`}>
        {value.toLocaleString('ar-EG')}{suffix ?? ' ج.م'}
      </p>
    </div>
  );
}