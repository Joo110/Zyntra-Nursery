import { z } from 'zod';

export const addBranchSchema = z.object({
  branchName: z.string().min(1, 'اسم الفرع مطلوب'),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type AddBranchFormValues = z.infer<typeof addBranchSchema>;

export const updateBranchSchema = addBranchSchema.extend({
  id: z.string(),
});

export type UpdateBranchFormValues = z.infer<typeof updateBranchSchema>;
