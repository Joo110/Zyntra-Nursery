import { z } from 'zod';

/**
 * فورم الإيداع/السحب اليدوي (مصاريف/إيرادات جانبية) — يستخدم نفس Endpoint إضافة حركة خزينة
 * الموجود بالفعل (POST /Treasury) بدون الحاجة لاختيار عضو (طفل/معلم/عامل).
 *
 * ⚠️ حقل "note" هنا لأغراض واجهة المستخدم فقط حاليًا (يُعرض في تأكيد الحفظ) —
 * AddTreasuryDataDto الحالي بالباك لا يحتوي على حقل ملاحظة/وصف، وهذا Gap
 * يحتاج تنسيق مع فريق الباك لإضافته (راجع خطة الفرونت § نقاط تحتاج تأكيد).
 */
export const manualTreasurySchema = z.object({
  trunsactionType: z.coerce.number(),
  amount: z.coerce.number().min(0.01, 'يجب أن يكون المبلغ أكبر من صفر'),
  dateTime: z.string().min(1, 'التاريخ مطلوب'),
  note: z.string().min(1, 'الملاحظة/سبب الحركة مطلوب'),
});

export type ManualTreasuryFormValues = z.infer<typeof manualTreasurySchema>;
