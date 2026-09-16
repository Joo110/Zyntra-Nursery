import { z } from 'zod';

export const addTeacherSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  qualification: z.string().min(1, 'المؤهل مطلوب'),
  school: z.string().min(1, 'الجامعة/المدرسة مطلوبة'),
  personalCardNumber: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phoneNumber: z.string().min(1, 'رقم الهاتف مطلوب'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  address: z.string().min(1, 'العنوان مطلوب'),
  levelId: z.string().min(1, 'برجاء اختيار المستوى'),
  classId: z.string().min(1, 'برجاء اختيار الفصل'),
  gender: z.coerce.number(),
  period: z.coerce.number(),
  salary: z.coerce.number().min(0, 'يجب أن يكون الراتب رقمًا موجبًا'),
});
export type AddTeacherFormValues = z.infer<typeof addTeacherSchema>;
