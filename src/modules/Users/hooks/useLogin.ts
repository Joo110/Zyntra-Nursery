import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuthStore } from '@/app/providers/authStore';
import { ROUTES } from '@/app/router/routes.constants';
import type { ApiError } from '@/types/api-error.types';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userName, password }: { userName: string; password: string }) =>
      userService.login(userName, password),
    onSuccess: (data) => {
      setUser(data);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: (error: ApiError) => {
      // 401 من الـ Backend يعني بيانات دخول خاطئة تحديدًا هنا (وليس جلسة منتهية)
      toast.error(
        error.status === 401
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
          : error.message
      );
    },
  });
}
