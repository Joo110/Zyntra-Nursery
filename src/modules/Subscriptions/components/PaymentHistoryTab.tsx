import { useState } from 'react';
import { useBranchStore } from '@/app/providers/branchStore';
import { usePaymentHistoryByDateRange } from '../hooks/useSubscriptions';
import type { PaymentHistoryInfoDto } from '../types/subscription.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { GenderBadge } from '@/components/common/GenderBadge';
import { Period } from '@/types/enums.types';

const PAGE_SIZE = 10;

const PERIOD_LABELS: Record<Period, string> = {
  [Period.AM]: 'صباحي',
  [Period.PM]: 'مسائي',
};

/** أول يوم في الشهر الحالي وآخره بصيغة YYYY-MM-DD */
function monthRange() {
  const now = new Date();
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export function PaymentHistoryTab() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id) ?? '';
  const initial = monthRange();
  const [dateFrom, setDateFrom] = useState(initial.from);
  const [dateTo, setDateTo] = useState(initial.to);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = usePaymentHistoryByDateRange(
    branchId,
    dateFrom,
    dateTo,
    pageNumber,
    PAGE_SIZE
  );

  // بحث بالاسم على الصفحة الحالية (الـ API مفيهوش فلتر اسم)
  const rows = (data?.items ?? []).filter((r) => !search.trim() || r.name.includes(search.trim()));

  const columns: ColumnDef<PaymentHistoryInfoDto>[] = [
    { key: 'name', header: 'اسم الطالب' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    { key: 'period', header: 'الفترة', render: (row) => PERIOD_LABELS[row.period] ?? '-' },
    {
      key: 'amount',
      header: 'المبلغ',
      render: (row) => <span className="ltr-numerals">{row.amount.toLocaleString('ar-EG')} ج.م</span>,
    },
    {
      key: 'dateOfPayment',
      header: 'تاريخ الدفع',
      render: (row) =>
        row.dateOfPayment ? new Date(row.dateOfPayment).toLocaleDateString('ar-EG') : '-',
    },
  ];

  const inputClass =
    'h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          من تاريخ
          <input
            type="date"
            value={dateFrom}
            max={dateTo}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPageNumber(1);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          إلى تاريخ
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPageNumber(1);
            }}
            className={inputClass}
          />
        </label>
        <input
          placeholder="ابحث بالاسم في الصفحة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} w-full max-w-xs`}
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row, i) => `${row.code}-${row.dateOfPayment}-${i}`}
          emptyMessage="لا يوجد مدفوعات في هذه الفترة"
        />
        {data && (
          <Pagination
            pageNumber={data.pageNumber}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            totalCount={data.totalCount}
            onPageChange={setPageNumber}
          />
        )}
      </div>
    </div>
  );
}