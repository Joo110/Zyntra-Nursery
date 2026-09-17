import { z } from 'zod';

export const addSalarySchema = z.object({
  employeeType: z.enum(['T', 'W'], { message: 'يجب اختيار معلم أو عامل' }),
  employeeId: z.string().min(1, 'يجب اختيار الموظف'),
  salaryMonth: z.string().min(1, 'يجب اختيار الشهر'),
  amount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من صفر'),
  isPaid: z.boolean().default(false),
});

/** نوع الإدخال قبل التحويل (amount ممكن يوصل كـ string من الـ input الأول) — يُستخدم في useForm */
export type AddSalaryFormInput = z.input<typeof addSalarySchema>;

/** نوع الإخراج بعد الـ validation/coerce (amount: number) — ده اللي بيوصل لـ onSubmit */
export type AddSalaryFormValues = z.output<typeof addSalarySchema>;