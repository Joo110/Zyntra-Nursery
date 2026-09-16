import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { useMessageArchiveList, useCreateMessageArchive, useDeleteMessageArchive } from '../hooks/useMessageArchive';
import { MessageArchiveForm } from '../components/MessageArchiveForm';
import type { AddMessageArchiveFormValues } from '../types/messageArchive.schema';
import type { MessageArchiveDto } from '../types/messageArchive.types';
import { DataTable, type ColumnDef } from '@/components/tables/DataTable';
import { Pagination } from '@/components/tables/Pagination';
import { DepartmentSelector } from '@/components/common/DepartmentSelector';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/modals/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useBranchStore } from '@/app/providers/branchStore';
import { PageLoader } from '@/components/loading/PageLoader';
import { MemberType, SentViaLabels } from '@/types/enums.types';
import type { SentVia } from '@/types/enums.types';

const PAGE_SIZE = 10;

export function MessageArchivePage() {
  const branchId = useBranchStore((s) => s.selectedBranch?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page') ?? '1');
  const departmentId = searchParams.get('departmentId') ?? '';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<MessageArchiveDto | null>(null);

  const { data, isLoading, isError } = useMessageArchiveList(branchId ?? '', pageNumber, PAGE_SIZE);
  const createMessage = useCreateMessageArchive(branchId ?? '');
  const deleteMessage = useDeleteMessageArchive(branchId ?? '');

  if (!branchId) return <PageLoader label="برجاء اختيار فرع أولًا..." />;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    setSearchParams(params);
  };

  const handleSubmit = (values: AddMessageArchiveFormValues) => {
    createMessage.mutate(
      { ...values, sentVia: values.sentVia as SentVia, memberType: MemberType.Child, dateTime: new Date().toISOString() },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  const columns: ColumnDef<MessageArchiveDto>[] = [
    { key: 'memberName', header: 'العضو', render: (row) => row.memberName || '—' },
    { key: 'sentVia', header: 'وسيلة الإرسال', render: (row) => SentViaLabels[row.sentVia] },
    { key: 'dateTime', header: 'التاريخ', render: (row) => <span className="ltr-numerals">{row.dateTime?.slice(0, 10) || '—'}</span> },
    { key: 'messageContant', header: 'الرسالة', render: (row) => <span className="line-clamp-1 max-w-xs">{row.messageContant || '—'}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><MessageSquare className="h-5 w-5" /> أرشيف الرسائل</h1>
          <p className="text-sm text-neutral-500">سجل الرسائل المرسلة لأولياء الأمور والمعلمين</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>تسجيل رسالة</Button>
      </div>

      <div className="w-full max-w-xs">
        <DepartmentSelector branchId={branchId} value={departmentId} onChange={(v) => updateParams({ departmentId: v })} />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          getRowId={(row) => row.id}
          emptyMessage="لا يوجد رسائل مسجلة حاليًا"
          rowActions={(row) => (
            <button onClick={() => setDeleting(row)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-danger" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
          )}
        />
        {data && (
          <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} hasNextPage={data.hasNextPage} hasPreviousPage={data.hasPreviousPage} totalCount={data.totalCount} onPageChange={(p) => updateParams({ page: String(p) })} />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="تسجيل رسالة">
        <MessageArchiveForm branchId={branchId} departmentId={departmentId} onSubmit={handleSubmit} isLoading={createMessage.isPending} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMessage.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        title="حذف الرسالة"
        message="هل أنت متأكد أنك تريد حذف هذا السجل؟"
        isLoading={deleteMessage.isPending}
      />
    </div>
  );
}
