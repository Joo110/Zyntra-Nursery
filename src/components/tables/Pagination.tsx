import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination عامة تعتمد على شكل PagedResult<T> الفعلي من الـ Backend
 * (راجع 02-API-Contract-Detailed.md § Global Conventions) — Server-side دائمًا.
 */
export function Pagination({
  pageNumber,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  totalCount,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row">
      <p className="text-xs text-neutral-500">
        إجمالي العناصر: <span className="ltr-numerals font-medium text-neutral-700">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(pageNumber - 1)}
          icon={<ChevronRight className="h-4 w-4" />}
        >
          السابق
        </Button>
        <span className="ltr-numerals text-sm text-neutral-600">
          {pageNumber} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          التالي
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
