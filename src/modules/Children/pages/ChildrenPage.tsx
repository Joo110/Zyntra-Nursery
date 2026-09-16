import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Archive, Cake } from 'lucide-react';
import { useChildrenList, useDeleteChild, useSetChildActive } from '../hooks/useChildren';
import type { ChildListDto } from '../types/child.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { GenderBadge } from '@/components/common/GenderBadge';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ChildDetailsModal } from '../components/ChildDetailsModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { Period } from '@/types/enums.types';
import { ROUTES } from '@/app/router/routes.constants';

const PAGE_SIZE = 10;

export function ChildrenPage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const period = Number(searchParams.get('period') ?? String(Period.AM)) as Period;
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400) || undefined;

  const [deleting, setDeleting] = useState<ChildListDto | null>(null);
  const [archiving, setArchiving] = useState<ChildListDto | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useChildrenList(
    branchId ?? '',
    departmentId,
    period,
    pageNumber,
    PAGE_SIZE,
    debouncedSearch
  );
  const deleteChild = useDeleteChild(branchId ?? '');
  const setActive = useSetChildActive(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<ChildListDto>[] = [
    { key: 'name', header: 'اسم الطالب', render: (row) => row.name || '—' },
    { key: 'gender', header: 'النوع', render: (row) => <GenderBadge gender={row.gender} /> },
    { key: 'level', header: 'المستوى', render: (row) => row.level || '—' },
    { key: 'class', header: 'الفصل', render: (row) => row.class || '—' },
    { key: 'callPhoneNumber', header: 'رقم التواصل', render: (row) => <span className="ltr-numerals">{row.callPhoneNumber || '—'}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">الطلاب</h1>
          <p className="text-sm text-neutral-500">إدارة طلاب الفرع المختار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Cake className="h-4 w-4" />} onClick={() => navigate(ROUTES.CHILDREN_BIRTHDAYS)}>
            أعياد الميلاد
          </Button>
          <Button variant="outline" icon={<Archive className="h-4 w-4" />} onClick={() => navigate(ROUTES.CHILDREN_ARCHIVE)}>
            الأرشيف
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate(ROUTES.CHILDREN_CREATE)}>
            إضافة طالب
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v, page: '1' })} />
        </div>
        <PeriodSelector value={period} onChange={(p) => updateParams({ period: String(p), page: '1' })} />
        <SearchInput
          value={searchInput}
          onChange={(v) => { setSearchInput(v); updateParams({ search: v, page: '1' }); }}
          placeholder="بحث باسم الطالب..."
        />
      </div>

      {!departmentId ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-surface p-10 text-center text-sm text-neutral-500">
          برجاء اختيار قسم لعرض الطلاب
        </div>
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            getRowId={(row) => row.id}
            onRowClick={(row) => setViewingId(row.id)}
            emptyMessage="لا يوجد طلاب حاليًا"
            emptyActionLabel="إضافة طالب"
            onEmptyAction={() => navigate(ROUTES.CHILDREN_CREATE)}
            rowActions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(ROUTES.childEdit(row.id), { state: { child: row } }); }}
                  className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary"
                  aria-label="تعديل"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setArchiving(row); }}
                  className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-warning"
                  aria-label="أرشفة"
                >
                  <Archive className="h-4 w-4" />
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
      )}

      <ChildDetailsModal branchId={branchId} childId={viewingId} onClose={() => setViewingId(null)} />

      <ConfirmModal
        isOpen={!!archiving}
        onClose={() => setArchiving(null)}
        onConfirm={() => archiving && setActive.mutate({ id: archiving.id, isActive: false }, { onSuccess: () => setArchiving(null) })}
        title="أرشفة الطالب"
        message={`هل أنت متأكد أنك تريد أرشفة الطالب "${archiving?.name}"؟ يمكنك استرجاعه لاحقًا من الأرشيف.`}
        confirmLabel="أرشفة"
        isLoading={setActive.isPending}
      />

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteChild.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف الطالب نهائيًا"
        message={`هل أنت متأكد أنك تريد حذف الطالب "${deleting?.name}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`}
        isLoading={deleteChild.isPending}
      />
    </div>
  );
}