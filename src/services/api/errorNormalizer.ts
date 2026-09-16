import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api-error.types';



const GENERIC_MESSAGES: Record<number, string> = {
  400: 'البيانات المُدخلة غير صحيحة، برجاء المراجعة والمحاولة مرة أخرى.',
  401: 'يجب تسجيل الدخول لتنفيذ هذه العملية.',
  403: 'ليس لديك صلاحية لتنفيذ هذه العملية.',
  404: 'العنصر المطلوب غير موجود.',
  409: 'يوجد تعارض في البيانات، برجاء المراجعة.',
  422: 'فشل التحقق من صحة البيانات المُدخلة.',
  500: 'حدث خطأ غير متوقع في الخادم، برجاء المحاولة مرة أخرى لاحقًا.',
};

function toCamelCaseKey(key: string): string {
  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function normalizeApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<any>;

  if (!axiosError?.response) {
    if (axiosError?.code === 'ECONNABORTED') {
      return {
        status: 0,
        message: 'استغرق الطلب وقتًا طويلًا، برجاء المحاولة مرة أخرى.',
        rawMessage: axiosError.message,
      };
    }
    return {
      status: 0,
      message: 'تعذّر الاتصال بالخادم، برجاء التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
      rawMessage: axiosError?.message,
    };
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data;


  if (data && typeof data === 'object' && 'error' in data && data.error?.message) {
    return {
      status,
      message: GENERIC_MESSAGES[status] ?? 'حدث خطأ غير متوقع.',
      rawMessage: data.error.message,
      code: data.error.code,
    };
  }


  if (
    status === 400 &&
    data &&
    typeof data === 'object' &&
    !('message' in data) &&
    Object.values(data).every((v) => Array.isArray(v))
  ) {
    const validationErrors: Record<string, string[]> = {};
    for (const [key, messages] of Object.entries(data as Record<string, string[]>)) {
      validationErrors[toCamelCaseKey(key)] = messages;
    }
    return {
      status,
      message: 'برجاء مراجعة الحقول المطلوبة.',
      validationErrors,
    };
  }

  if (data && typeof data === 'object' && 'message' in data) {
    return {
      status,
      message: GENERIC_MESSAGES[status] ?? String(data.message),
      rawMessage: String(data.message),
    };
  }

  return {
    status,
    message: GENERIC_MESSAGES[status] ?? 'حدث خطأ غير متوقع.',
    rawMessage: typeof data === 'string' ? data : undefined,
  };
}
