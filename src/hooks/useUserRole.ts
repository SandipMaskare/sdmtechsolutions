import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, pickRole } from "@/lib/roles";

export const useUserRole = () => {
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const [rolesRes, profileRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (rolesRes.error) console.error("Role fetch error:", rolesRes.error);
      if (profileRes.error) console.error("Profile fetch error:", profileRes.error);

      const roles = rolesRes.data || [];
      setProfile(profileRes.data);
      setRole(pickRole(roles));
      setLoading(false);
    };

    getUserRole();
  }, []);

  return { role, profile, user, loading };
};
