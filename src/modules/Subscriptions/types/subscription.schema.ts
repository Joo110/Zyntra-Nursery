import { z } from 'zod';

export const addSubscriptionSchema = z.object({
  childId: z.string().min(1, 'اختر الطالب'),
  monthSubscription: z.string().min(1, 'اختر شهر الاشتراك'),
  amount: z.coerce.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  dateOfPayment: z.string().nullable().optional(),
  isPaid: z.boolean().default(true),
});

export type AddSubscriptionFormValues = z.infer<typeof addSubscriptionSchema>;

export const updateSubscriptionSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1, 'اختر الطالب').optional(),
  monthSubscription: z.string().min(1, 'اختر شهر الاشتراك').optional(),
  amount: z.coerce.number().positive('المبلغ يجب أن يكون أكبر من صفر').optional(),
  dateOfPayment: z.string().nullable().optional(),
  isPaid: z.boolean().optional(),
});

export type UpdateSubscriptionFormValues = z.infer<typeof updateSubscriptionSchema>;