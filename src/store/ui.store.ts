import { create } from "zustand";
import type { ToastType } from "@/types";

export interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  foreground: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "blue", name: "Classic Blue", primary: "hsl(217.2 91.2% 59.8%)", foreground: "hsl(222.2 47.4% 11.2%)" },
  { id: "violet", name: "Royal Violet", primary: "hsl(262.1 83.3% 57.8%)", foreground: "hsl(210 20% 98%)" },
  { id: "emerald", name: "Forest Emerald", primary: "hsl(142.1 76.2% 36.3%)", foreground: "hsl(355.7 100% 99.7%)" },
  { id: "rose", name: "Sweet Rose", primary: "hsl(346.8 77.2% 49.8%)", foreground: "hsl(355.7 100% 99.7%)" },
  { id: "amber", name: "Golden Amber", primary: "hsl(37.9 92.1% 50.2%)", foreground: "hsl(240 10% 3.9%)" },
  { id: "indigo", name: "Electric Indigo", primary: "hsl(239 84% 67%)", foreground: "hsl(0 0% 100%)" },
];

export const applyTheme = (themeId: string): void => {
  const selectedTheme = THEME_OPTIONS.find((t) => t.id === themeId) || THEME_OPTIONS[0];
  document.documentElement.style.setProperty("--color-primary", selectedTheme.primary);
  document.documentElement.style.setProperty("--color-primary-foreground", selectedTheme.foreground);
  localStorage.setItem("taskdock-theme", themeId);
};

export interface ToastInfo {
  message: string;
  type: ToastType;
  id: number;
}

interface UiState {
  sidebarOpen: boolean;
  theme: string;
  toast: ToastInfo | null;
  actions: {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (themeId: string) => void;
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
  };
}



let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>()((set) => {
  const savedTheme = localStorage.getItem("taskdock-theme") || "blue";

  setTimeout(() => applyTheme(savedTheme), 0);

  return {
    sidebarOpen: true,
    theme: savedTheme,
    toast: null,
    actions: {
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (themeId) => {
        applyTheme(themeId);
        set({ theme: themeId });
      },
      showToast: (message, type = "info") => {
        if (toastTimer) {
          clearTimeout(toastTimer);
        }
        const id = Date.now();
        set({ toast: { message, type, id } });
        toastTimer = setTimeout(() => {
          set({ toast: null });
        }, 4000);
      },
      hideToast: () => {
        if (toastTimer) {
          clearTimeout(toastTimer);
        }
        set({ toast: null });
      },
    },
  };
});

export const useSidebarOpen = (): boolean => useUiStore((state) => state.sidebarOpen);
export const useCurrentTheme = (): string => useUiStore((state) => state.theme);
export const useToast = (): ToastInfo | null => useUiStore((state) => state.toast);
export const useUiActions = (): UiState["actions"] => useUiStore((state) => state.actions);

