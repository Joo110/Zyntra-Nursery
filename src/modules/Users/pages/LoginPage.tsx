import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../types/login.schema';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-2">
      {/* الجانب الزخرفي */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-10 text-white md:flex lg:p-16">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full border-[3px] border-white" />
          <div className="absolute bottom-16 right-0 h-56 w-56 rounded-full border-[3px] border-white" />
          <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full border-[3px] border-white" />
        </div>

       <div className="relative flex items-center justify-start gap-2">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
    <Sparkles className="h-5 w-5" />
  </div>
  <span className="text-lg font-bold">نظام إدارة الحضانة</span>
</div>

        <div className="relative flex flex-col gap-4 text-right">
          <h2 className="text-3xl font-bold leading-relaxed lg:text-4xl">
            إدارة أسهل، وقت أوفر، ومتابعة كاملة لكل تفاصيل حضانتك
          </h2>
          <div className="flex items-center justify-end gap-2 text-sm text-white/80">
            <span>بياناتك محمية وآمنة بالكامل</span>
            <ShieldCheck className="h-4 w-4 shrink-0" />
          </div>
        </div>

        <p className="relative text-xs text-white/60">
          جميع الحقوق محفوظة © {new Date().getFullYear()}
        </p>
      </div>

      {/* جانب الفورم */}
      <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 text-center md:items-start md:text-right">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light shadow-sm">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">تسجيل الدخول</h1>
              <p className="mt-1 text-sm text-neutral-500">أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <FormField label="اسم المستخدم" required error={errors.userName?.message} htmlFor="userName">
              <Input
                id="userName"
                autoComplete="username"
                placeholder="ادخل اسم المستخدم"
                {...register('userName')}
                error={errors.userName?.message}
              />
            </FormField>

            <FormField label="كلمة المرور" required error={errors.password?.message} htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="ادخل كلمة المرور"
                {...register('password')}
                error={errors.password?.message}
              />
            </FormField>

            <Button
              type="submit"
              className="mt-3 w-full shadow-lg shadow-primary/25"
              isLoading={loginMutation.isPending}
            >
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-10 text-center text-xs text-neutral-400 md:hidden">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}