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

export const useSidebarOpen = () => useUiStore((state) => state.sidebarOpen);
export const useUiActions = () => useUiStore((state) => state.actions);
