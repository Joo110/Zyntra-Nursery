import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionService } from '../services/subscriptionService';
import type { AddSubscriptionDto, UpdateSubscriptionDto } from '../types/subscription.types';
import type { ApiError } from '@/types/api-error.types';
import type { Period } from '@/types/enums.types';
import { departmentKeys } from '@/constants/queryKeys.constants';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  unpaid: (branchId: string, period: Period, pageNumber: number, take: number) =>
    [...subscriptionKeys.all, 'unpaid', branchId, period, { pageNumber, take }] as const,
  paymentHistoryByChild: (branchId: string, childId: string, pageNumber: number, take: number) =>
    [...subscriptionKeys.all, 'payment-history', branchId, childId, { pageNumber, take }] as const,
  paymentHistoryByRange: (branchId: string, dateFrom: string, dateTo: string, pageNumber: number, take: number) =>
    [...subscriptionKeys.all, 'payment-history-range', branchId, { dateFrom, dateTo, pageNumber, take }] as const,
  childrenInfo: (branchId: string, period: Period, pageNumber: number, take: number, name?: string) =>
    [...subscriptionKeys.all, 'children-info', branchId, period, { pageNumber, take, name }] as const,
  receipt: (branchId: string, subscriptionId: string) =>
    [...subscriptionKeys.all, 'receipt', branchId, subscriptionId] as const,
};

/** راجع 05-Caching-....md: Subscriptions staleTime = 30 ثانية */
export function useUnpaidSubscriptions(branchId: string, period: Period, pageNumber: number, take: number) {
  return useQuery({
    queryKey: subscriptionKeys.unpaid(branchId, period, pageNumber, take),
    queryFn: () => subscriptionService.getUnpaid(branchId, period, pageNumber, take),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

export function usePaymentHistoryByChild(branchId: string, childId: string, pageNumber: number, take: number) {
  return useQuery({
    queryKey: subscriptionKeys.paymentHistoryByChild(branchId, childId, pageNumber, take),
    queryFn: () => subscriptionService.getPaymentHistoryByChild(branchId, childId, pageNumber, take),
    enabled: !!branchId && !!childId,
    staleTime: 30_000,
  });
}

export function usePaymentHistoryByDateRange(
  branchId: string,
  dateFrom: string,
  dateTo: string,
  pageNumber: number,
  take: number
) {
  return useQuery({
    queryKey: subscriptionKeys.paymentHistoryByRange(branchId, dateFrom, dateTo, pageNumber, take),
    queryFn: () => subscriptionService.getPaymentHistoryByDateRange(branchId, dateFrom, dateTo, pageNumber, take),
    enabled: !!branchId && !!dateFrom && !!dateTo,
    staleTime: 30_000,
  });
}

export function useChildrenSubscriptionInfo(
  branchId: string,
  period: Period,
  pageNumber: number,
  take: number,
  name?: string
) {
  return useQuery({
    queryKey: subscriptionKeys.childrenInfo(branchId, period, pageNumber, take, name),
    queryFn: () => subscriptionService.getChildrenSubscriptionInfo(branchId, period, pageNumber, take, name),
    enabled: !!branchId,
    staleTime: 30_000,
  });
}

/** جاهزة للاستخدام بمجرد ما يبقى عندنا subscriptionId من أي مصدر */
export function useSubscriptionReceipt(branchId: string, subscriptionId: string | null) {
  return useQuery({
    queryKey: subscriptionKeys.receipt(branchId, subscriptionId ?? ''),
    queryFn: () => subscriptionService.getReceipt(branchId, subscriptionId as string),
    enabled: !!branchId && !!subscriptionId,
    staleTime: 60_000,
  });
}

/** راجع 03-Business-Flow.md § Subscriptions Flow - Invalidate يشمل department-financial-stats المرتبطة */
export function useCreateSubscription(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddSubscriptionDto) => subscriptionService.add(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('تم تسجيل الدفع بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}

/** جاهزة للاستخدام بمجرد ما يبقى عندنا subscriptionId من أي مصدر */
export function useUpdateSubscription(branchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSubscriptionDto) => subscriptionService.update(branchId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('تم تحديث الاشتراك بنجاح');
    },
    onError: (e: ApiError) => toast.error(e.message),
  });
}