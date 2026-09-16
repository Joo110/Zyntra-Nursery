import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useChildrenSubscriptionInfo } from '../hooks/useSubscriptions';
import type { ChildSubscriptionInfoDto } from '../types/subscription.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { GenderBadge } from '@/components/common/GenderBadge';
import { Input } from '@/components/forms/Input';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const PAGE_SIZE = 10;

const PERIOD_LABELS: Record<Period, string> = {
  [Period.AM]: 'صباحي',
  [Period.PM]: 'مسائي',
};

export function ChildrenSubscriptionInfoPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const period = Number(searchParams.get('period') ?? Period.AM) as Period;

  const [nameInput, setNameInput] = useState(searchParams.get('name') ?? '');
  const debouncedName = useDebouncedValue(nameInput, 400);

  const { data, isLoading, isError } = useChildrenSubscriptionInfo(
    branchId ?? '',
    period,
    pageNumber,
    PAGE_SIZE,
    debouncedName || undefined
  );

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    if (!('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  const columns: ColumnDef<ChildSubscriptionInfoDto>[] = [
    { key: 'name', header: 'اسم الطالب' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'className', header: 'الفصل' },
    {
      key: 'subscriptionAmount',
      header: 'قيمة الاشتراك',
      render: (row) => <span className="ltr-numerals">{row.subscriptionAmount.toLocaleString('ar-EG')} ج.م</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
          <Users className="h-5 w-5" /> بيانات اشتراكات الطلاب
        </h1>
        <p className="text-sm text-neutral-500">عرض بيانات اشتراك الطلاب حسب الفترة</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <Input
            placeholder="ابحث بالاسم..."
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              updateParams({ name: e.target.value });
            }}
          />
        </div>
        <select
          value={period}
          onChange={(e) => updateParams({ period: e.target.value })}
          className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:border-primary focus:outline-none"
        >
          {Object.values(Period)
            .filter((v): v is Period => typeof v === 'number')
            .map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABELS[p]}
              </option>
            ))}
        </select>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.code}
          emptyMessage="لا يوجد بيانات اشتراكات لعرضها"
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
    </div>
  );
}