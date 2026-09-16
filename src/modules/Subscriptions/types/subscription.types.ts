import type { Gender, Period } from '@/types/enums.types';

export interface ChildSubscriptionInfoDto {
  gender: Gender;
  code: string;
  name: string;
  className: string;
  subscriptionAmount: number;
}

export interface PaymentSubscriptionInfoDto {
  gender: Gender;
  code: string;
  name: string;
  date?: string | null;
  levelName: string;
  className: string;
  period: Period;
  amount: number;
}

export interface PaymentHistoryInfoDto {
  gender: Gender;
  code: string;
  name: string;
  levelName: string;
  className: string;
  period: Period;
  amount: number;
  dateOfPayment?: string | null;
}

export interface AddSubscriptionDto {
  childId: string;
  amount: number;
  monthSubscription: string;
  dateOfPayment?: string | null;
  isPaid: boolean;
}

export interface UpdateSubscriptionDto {
  id: string;
  childId?: string;
  amount?: number;
  monthSubscription?: string;
  dateOfPayment?: string | null;
  isPaid?: boolean;
}

export interface SubscriptionReceiptDto {
  subscriptionId: string;
  childId: string;
  childName: string;
  childGender: Gender;
  amount: number;
  subscriptionMonth: string;
  remainder: number;
  isPaid: boolean;
  dateOfPayment: string | null;
  generatedDate: string;
}