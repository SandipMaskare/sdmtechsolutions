import React, { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!isMounted) return;

    if (error) {
      console.error("Error fetching profile:", error);
      setRole(null);
    } else {
      setRole(data?.role ?? null);
    }
  };

  const initialize = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!isMounted) return;

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      await fetchProfile(session.user.id);
    }

    setLoading(false);
  };

  initialize();

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);
