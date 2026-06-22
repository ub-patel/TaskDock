import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { supabase } from "@/lib/supabase-client";
import { useAuthStore } from "@/store/auth.store";

// Initialize session state change listener
supabase.auth.onAuthStateChange((_event, session) => {
  const { setUser, setLoading } = useAuthStore.getState().actions;
  setUser(session?.user ?? null);
  setLoading(false);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
