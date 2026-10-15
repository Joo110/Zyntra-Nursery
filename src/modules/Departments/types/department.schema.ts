import { z } from 'zod';

export const addDepartmentSchema = z.object({
  departmentName: z.string().min(1, 'اسم القسم مطلوب'),
  subscriptionPrice: z.coerce.number().min(0, 'يجب أن يكون السعر رقمًا موجبًا'),
  worksSunday: z.boolean(),
  worlsMonday: z.boolean(),
  worksTuesday: z.boolean(),
  worksWednesday: z.boolean(),
  worksThursday: z.boolean(),
  worksFriday: z.boolean(),
  worksSaturday: z.boolean(),
  isPrimaryDepartment: z.boolean(),
});

export type AddDepartmentFormValues = z.infer<typeof addDepartmentSchema>;
