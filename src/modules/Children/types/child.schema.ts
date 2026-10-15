import { z } from 'zod';

export const addChildSchema = z.object({
  name: z.string().optional(),
  city: z.string().min(1, 'المدينة مطلوبة'),
  address: z.string().min(1, 'العنوان مطلوب'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  levelId: z.string().min(1, 'برجاء اختيار المستوى'),
  classId: z.string().min(1, 'برجاء اختيار الفصل'),
  dateOfSubscraip: z.string().min(1, 'تاريخ الاشتراك مطلوب'),
  departmentId: z.array(z.string()).min(1, 'برجاء اختيار قسم واحد على الأقل'),
  gender: z.coerce.number(),
  callPhoneNumber: z.string().min(1, 'رقم هاتف التواصل مطلوب'),
  period: z.coerce.number(),
  howYouKnowNursery: z.coerce.number(),
  socialStatus: z.coerce.number().optional(),
  messageNumber: z.string().min(1, 'رقم الرسائل مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  busId: z.string().optional(),
  isAdvancePaymentMade: z.boolean().optional(),
  advancePaymentAmount: z.coerce.number().min(0, 'يجب أن يكون المبلغ رقمًا موجبًا').optional(),
});

export type AddChildFormValues = z.infer<typeof addChildSchema>;