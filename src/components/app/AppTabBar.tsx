import { NavLink, useLocation } from "react-router-dom";
import { Home, Briefcase, GraduationCap, Layers, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const HIDE_ON = ["/intern", "/employee", "/crm", "/admin", "/app/admin"];

/** Bottom tab bar for the public part of the installed app. Portals have their own. */
const AppTabBar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  const tabs = [
    { to: "/", end: true, icon: Home, label: "Home" },
    { to: "/services", end: false, icon: Layers, label: "Services" },
    { to: "/internships", end: false, icon: GraduationCap, label: "Internships" },
    { to: "/careers", end: false, icon: Briefcase, label: "Careers" },
    { to: user ? "/enter" : "/intern/login", end: false, icon: UserCircle, label: user ? "Portal" : "Sign in" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border grid grid-cols-5" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map((t) => (
        <NavLink
          key={t.label}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            cn("flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-[11px] font-medium active:bg-accent", isActive && t.label !== "Portal" && t.label !== "Sign in" ? "text-primary" : "text-muted-foreground")
          }
        >
          {({ isActive }) => {
            const on = isActive && t.label !== "Portal" && t.label !== "Sign in";
            return (
              <>
                <span className={cn("h-7 w-12 rounded-full flex items-center justify-center", on && "bg-accent")}>
                  <t.icon className="w-5 h-5" />
                </span>
                {t.label}
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
};

export default AppTabBar;
