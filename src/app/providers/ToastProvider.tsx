import { Toaster } from 'sonner';

/**
 * نظام إشعارات موحّد لكل التطبيق (راجع Master Prompt بند 17/23).
 * كل رسائل النجاح/الخطأ/التحذير تمر من هنا عبر `toast.success()` / `toast.error()` من 'sonner'.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      dir="rtl"
      richColors
      closeButton
      toastOptions={{
        style: { fontFamily: 'Tajawal, sans-serif', fontSize: '14px' },
      }}
    />
  );
}
