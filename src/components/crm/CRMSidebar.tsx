import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  Users, 
  ClipboardList, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import sdmLogo from "@/assets/sdm-logo.jpg";

interface CRMSidebarProps {
  userRole: "admin" | "employee";
}

const CRMSidebar = ({ userRole }: CRMSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  const adminLinks = [
    { to: "/crm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/crm/employees", icon: Users, label: "Employees" },
    { to: "/crm/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/crm/submissions", icon: CheckSquare, label: "Submissions" },
    { to: "/crm/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/crm/settings", icon: Settings, label: "Settings" },
  ];

  const employeeLinks = [
    { to: "/crm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/crm/my-tasks", icon: ClipboardList, label: "My Tasks" },
    { to: "/crm/my-submissions", icon: CheckSquare, label: "Submissions" },
    { to: "/crm/performance", icon: BarChart3, label: "Performance" },
  ];

  const links = userRole === "admin" ? adminLinks : employeeLinks;

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <a href="/" className="flex items-center gap-2">
            <img src={sdmLogo} alt="SDM" className="h-8" />
          </a>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <link.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-border space-y-1">
        <a
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          )}
        >
          <Building2 className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Back to Site</span>}
        </a>
        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            "hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default CRMSidebar;
