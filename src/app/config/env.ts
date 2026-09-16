/**
 * إعدادات البيئة المركزية — لا تضع API URL بشكل Hardcoded في أي مكان آخر بالمشروع.
 * (راجع Master Prompt بند 19)
 */
function readEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    if (fallback !== undefined) return fallback;
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing environment variable: ${key}`);
    return '';
  }
  return value;
}

export const env = {
  apiBaseUrl: readEnvVar('VITE_API_BASE_URL', 'https://localhost:7000/api'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
