import { z } from 'zod';

export const addSalarySchema = z.object({
  employeeType: z.enum(['T', 'W'], { message: 'يجب اختيار معلم أو عامل' }),
  employeeId: z.string().min(1, 'يجب اختيار الموظف'),
  salaryMonth: z.string().min(1, 'يجب اختيار الشهر'),
  amount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من صفر'),
  isPaid: z.boolean().default(false),
});

export type AddSalaryFormValues = z.infer<typeof addSalarySchema>;