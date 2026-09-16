import type { LoggedInStaffDto } from '@/modules/Users/types/user.types';

const AUTH_STORAGE_KEY = 'zyntra_auth';

export const authStorage = {
  get(): LoggedInStaffDto | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as LoggedInStaffDto;
    } catch {
      return null;
    }
  },

  set(data: LoggedInStaffDto): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },

  clear(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
