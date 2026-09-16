import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertOctagon, ListChecks } from 'lucide-react';
import { useRegistersList, useDeleteAllRegisters } from '../hooks/useRegisters';
import type { RegisterDto } from '../types/register.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { Button } from '@/components/common/Button';
import { DangerConfirmModal } from '@/components/modals/DangerConfirmModal';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { UserRole } from '@/types/enums.types';

const PAGE_SIZE = 10;

export function RegistersOperationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const [deletingAll, setDeletingAll] = useState(false);

  const { data, isLoading, isError } = useRegistersList(pageNumber, PAGE_SIZE);
  const deleteAll = useDeleteAllRegisters();

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const columns: ColumnDef<RegisterDto>[] = [
    { key: 'userName', header: 'المستخدم' },
    { key: 'date', header: 'التاريخ', render: (row) => <span className="ltr-numerals">{row.date.slice(0, 19).replace('T', ' ')}</span> },
    { key: 'status', header: 'الحالة' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><ListChecks className="h-5 w-5" /> سجل الدخول والخروج</h1>
          <p className="text-sm text-neutral-500">سجل عمليات دخول وخروج المستخدمين من النظام</p>
        </div>
        <RoleGuard allow={[UserRole.Admin]}>
          <Button variant="danger" icon={<AlertOctagon className="h-4 w-4" />} onClick={() => setDeletingAll(true)}>حذف كل السجلات</Button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        getRowId={(row) => row.id}
        emptyMessage="لا يوجد سجلات دخول/خروج بعد"
      />
      {data && (
        <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
      )}

      <DangerConfirmModal
        isOpen={deletingAll}
        onClose={() => setDeletingAll(false)}
        onConfirm={() => deleteAll.mutate(undefined, { onSuccess: () => setDeletingAll(false) })}
        title="حذف كل سجلات الدخول/الخروج"
        message="هذا الإجراء سيحذف كل سجلات الدخول والخروج نهائيًا ولا يمكن التراجع عنه."
        isLoading={deleteAll.isPending}
      />
    </div>
  );
}
