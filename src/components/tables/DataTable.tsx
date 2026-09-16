import type { ReactNode } from 'react';
import { Inbox, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  isError: boolean;
  getRowId: (row: T, index: number) => string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  getRowId,
  emptyMessage = 'لا توجد بيانات حاليًا',
  emptyActionLabel,
  onEmptyAction,
  rowActions,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-surface">
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4">
              {columns.map((col) => (
                <div key={col.key} className="h-4 flex-1 animate-pulse rounded bg-neutral-200" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-surface p-10 text-center">
        <AlertTriangle className="h-10 w-10 text-danger" />
        <p className="text-sm text-neutral-600">حدث خطأ أثناء تحميل البيانات، برجاء المحاولة مرة أخرى.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-surface p-10 text-center">
        <Inbox className="h-10 w-10 text-neutral-300" />
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
        {emptyActionLabel && onEmptyAction && (
          <Button size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-surface">
      <table className="w-full min-w-max text-start text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-100/60">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-start font-medium text-neutral-600 ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
            {rowActions && <th className="px-4 py-3 text-start font-medium text-neutral-600">إجراءات</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((row, index) => (
            <tr
              key={getRowId(row, index)}
              className={`hover:bg-neutral-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-neutral-800 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                </td>
              ))}
              {rowActions && <td className="px-4 py-3">{rowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}