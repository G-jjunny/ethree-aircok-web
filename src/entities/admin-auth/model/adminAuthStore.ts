import { create } from 'zustand';
import type { AdminUser } from '../api/adminAuthApi';

interface AdminAuthState {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
