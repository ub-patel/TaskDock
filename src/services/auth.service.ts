import { supabase } from "@/lib/supabase-client";
import type { AuthInput } from "@/types";
import type { User, Session } from "@supabase/supabase-js";

export class AuthService {
  static async signUp({
    email,
    password,
    fullName,
  }: AuthInput): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });
    if (error) throw error;
    return data;
  }

  static async signIn({
    email,
    password,
  }: Omit<AuthInput, "fullName">): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
}
