import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG } from "@/config/app.config";

if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey) {
  console.warn(
    "Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file."
  );
}

export const supabase = createClient(
  APP_CONFIG.supabaseUrl || "https://placeholder-url.supabase.co",
  APP_CONFIG.supabaseAnonKey || "placeholder-anon-key"
);
