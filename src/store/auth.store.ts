import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  actions: {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  actions: {
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
  },
}));

// Export hooks for selectors with explicit return types
export const useAuthUser = (): User | null => useAuthStore((state) => state.user);
export const useAuthLoading = (): boolean => useAuthStore((state) => state.loading);
export const useAuthActions = (): AuthState["actions"] => useAuthStore((state) => state.actions);
