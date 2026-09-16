import { z } from 'zod';

/**
 * لا توجد قيود Backend حقيقية إضافية (لا MinLength ولا Regex) — راجع
 * 02-API-Contract-Detailed.md § Global Conventions. الاعتماد فقط على "مطلوب".
 */
export const loginSchema = z.object({
  userName: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
