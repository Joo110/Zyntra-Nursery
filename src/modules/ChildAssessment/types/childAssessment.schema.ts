import { z } from 'zod';

export const addAssessmentSchema = z.object({
  childId: z.string().min(1, 'برجاء اختيار الطالب'),
  departmentId: z.string().min(1, 'برجاء اختيار القسم'),
  currentLevel: z.string().min(1, 'المستوى الحالي مطلوب'),
  progress: z.string().optional(),
  workbook: z.string().optional(),
  pageReached: z.coerce.number().optional(),
  notes: z.string().optional(),
  assessmentDate: z.string().min(1, 'تاريخ التقييم مطلوب'),
});

export type AddAssessmentFormValues = z.infer<typeof addAssessmentSchema>;
