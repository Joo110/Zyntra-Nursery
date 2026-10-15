import { create } from 'zustand';
import type { LoggedInStaffDto } from '@/modules/Users/types/user.types';
import { authStorage } from '@/services/auth/authStorage';

interface AuthState {
  user: LoggedInStaffDto | null;
  isAuthenticated: boolean;
  setUser: (user: LoggedInStaffDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authStorage.get(),
  isAuthenticated: authStorage.get() !== null,
  setUser: (user) => {
    authStorage.set(user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    authStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
