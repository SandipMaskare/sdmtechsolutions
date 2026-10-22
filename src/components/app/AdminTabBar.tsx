import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Users, ClipboardList, Wallet, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_ON = ["/crm", "/admin", "/app/admin"];

/** Bottom tab bar for admins inside the installed app (CRM and Admin Panel). */
const AdminTabBar = () => {
  const { pathname } = useLocation();
  if (!SHOW_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  const tabs = [
    { to: "/app/admin", icon: LayoutGrid, label: "Hub", end: true },
    { to: "/crm/employees", icon: Users, label: "People", end: false },
    { to: "/crm/tasks", icon: ClipboardList, label: "Tasks", end: false },
    { to: "/crm/payments", icon: Wallet, label: "Payments", end: false },
    { to: "/admin", icon: Shield, label: "Admin", end: false },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border grid grid-cols-5" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map((t) => (
        <NavLink key={t.label} to={t.to} end={t.end} className={({ isActive }) => cn("flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-[11px] font-medium active:bg-accent", isActive ? "text-primary" : "text-muted-foreground")}>
          {({ isActive }) => (
            <>
              <span className={cn("h-7 w-12 rounded-full flex items-center justify-center", isActive && "bg-accent")}><t.icon className="w-5 h-5" /></span>
              {t.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminTabBar;
