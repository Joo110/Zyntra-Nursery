import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { ApiError } from '@/types/api-error.types';

/**
 * راجع 04-Architecture-CoreInfra-DesignSystem-SharedComponents.md § 5.2
 * ولاستراتيجية الـ Caching المفصلة لكل Module: 05-Caching-Pagination-Search-Filtering.md § Phase 8
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as unknown as ApiError)?.status;
        // لا نعيد المحاولة تلقائيًا لأخطاء منطقية (400/401/403/404) - راجع Master Prompt بند 26
        if ([400, 401, 403, 404].includes(status)) return false;
        return failureCount < 2;
      },
      staleTime: 30_000, // افتراضي عام - كل Module يخصص staleTime الخاص به عند الحاجة
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
