import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  actions: {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
  };
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  actions: {
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  },
}));

// Selectors with explicit return types
export const useSidebarOpen = (): boolean => useUiStore((state) => state.sidebarOpen);
export const useUiActions = (): UiState["actions"] => useUiStore((state) => state.actions);
