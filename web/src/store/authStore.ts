import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  role: string;
}

interface AuthStore {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: (user: AuthUser) => {
        set({ currentUser: user, isAuthenticated: true });
      },
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

