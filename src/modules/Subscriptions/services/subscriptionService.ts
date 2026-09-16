import { axiosInstance } from '@/services/api/axiosInstance';
import type { PagedResult, MessageResponse } from '@/types/pagination.types';
import type {
  PaymentSubscriptionInfoDto,
  PaymentHistoryInfoDto,
  ChildSubscriptionInfoDto,
  AddSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionReceiptDto,
} from '../types/subscription.types';
import type { Period } from '@/types/enums.types';

/** راجع 02-API-Contract-Detailed.md § 14) Subscriptions */
export const subscriptionService = {
  getUnpaid: (branchId: string, period: Period, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<PaymentSubscriptionInfoDto>>(`/branches/${branchId}/Subscriptions/unpaid-subscriptions`, {
        params: { period, pageNumber, take },
      })
      .then((res) => res.data),

  getPaymentHistoryByChild: (branchId: string, childId: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<PaymentHistoryInfoDto>>(`/branches/${branchId}/Subscriptions/payment-history/${childId}`, { params: { pageNumber, take } })
      .then((res) => res.data),

  getPaymentHistoryByDateRange: (branchId: string, dateFrom: string, dateTo: string, pageNumber: number, take: number) =>
    axiosInstance
      .get<PagedResult<PaymentHistoryInfoDto>>(`/branches/${branchId}/Subscriptions/payment-history`, {
        params: { dateFrom, dateTo, pageNumber, take },
      })
      .then((res) => res.data),

  getChildrenSubscriptionInfo: (branchId: string, period: Period, pageNumber: number, take: number, name?: string) =>
    axiosInstance
      .get<PagedResult<ChildSubscriptionInfoDto>>(`/branches/${branchId}/Subscriptions/children-subscription-info`, {
        params: { period, pageNumber, take, name },
      })
      .then((res) => res.data),

  getReceipt: (branchId: string, subscriptionId: string) =>
    axiosInstance
      .get<SubscriptionReceiptDto>(`/branches/${branchId}/Subscriptions/receipt/${subscriptionId}`)
      .then((res) => res.data),

  add: (branchId: string, dto: AddSubscriptionDto) =>
    axiosInstance.post<MessageResponse>(`/branches/${branchId}/Subscriptions`, dto).then((res) => res.data),

  update: (branchId: string, dto: UpdateSubscriptionDto) =>
    axiosInstance.put<MessageResponse>(`/branches/${branchId}/Subscriptions`, dto).then((res) => res.data),

  remove: (branchId: string, subscriptionId: string) =>
    axiosInstance.delete<MessageResponse>(`/branches/${branchId}/Subscriptions/${subscriptionId}`).then((res) => res.data),
};