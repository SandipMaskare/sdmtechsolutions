import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Briefcase, ClipboardList, FileText, Inbox, LayoutDashboard, Layers, Library, Mail, MessageSquare, Send, Settings, Shield, Sparkles, TrendingUp, Users, Wallet, LogOut, Compass, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { homePath } from "@/lib/roles";
import { AppShell, Card, Heading, Spinner } from "@/components/app/AppShell";

const crm = [
  { to: "/crm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/crm/employees", icon: Users, label: "People" },
  { to: "/crm/batches", icon: Layers, label: "Batches" },
  { to: "/crm/tasks", icon: ClipboardList, label: "Tasks" },
  { to: "/crm/submissions", icon: Send, label: "Submissions" },
  { to: "/crm/payments", icon: Wallet, label: "Payments" },
  { to: "/crm/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/crm/task-library", icon: Library, label: "Task library" },
  { to: "/crm/performance", icon: TrendingUp, label: "Performance" },
  { to: "/crm/settings", icon: Settings, label: "Settings" },
];
const panel = [
  { to: "/admin?tab=jobs", icon: Briefcase, label: "Jobs" },
  { to: "/admin?tab=applications", icon: FileText, label: "Applications" },
  { to: "/admin?tab=messages", icon: MessageSquare, label: "Messages" },
  { to: "/admin?tab=inbox", icon: Inbox, label: "Mail inbox" },
  { to: "/admin?tab=email", icon: Mail, label: "Email center" },
  { to: "/admin?tab=offers", icon: Sparkles, label: "Offer letters" },
  { to: "/admin?tab=chat", icon: MessageSquare, label: "Chat" },
  { to: "/admin?tab=content", icon: Settings, label: "Site content" },
  { to: "/admin?tab=services", icon: Shield, label: "Services" },
];

const Tile = ({ to, icon: Icon, label }: { to: string; icon: typeof Users; label: string }) => (
  <Link to={to} className="rounded-2xl bg-white border border-black/5 shadow-sm p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
    <span className="h-11 w-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center"><Icon className="w-5 h-5 text-[#0f766e]" /></span>
    <span className="text-xs font-medium text-foreground text-center leading-tight">{label}</span>
  </Link>
);

/** Admin home of the installed app: every CRM and Admin Panel section in one place. */
const AppAdminHub = () => {
  const { role, loading } = useUserRole();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && role !== "admin") navigate(role ? homePath(role) : "/", { replace: true }); }, [loading, role, navigate]);
  if (loading || role !== "admin") return <AppShell><Spinner /></AppShell>;
  return (
    <AppShell>
      <Card className="p-4 flex items-center gap-3 bg-gradient-to-br from-[#0b3b4a] to-[#0f766e] text-white border-0">
        <Shield className="w-8 h-8" />
        <div className="min-w-0"><p className="font-display font-semibold">Admin</p><p className="text-xs text-white/80 truncate">{user?.email}</p></div>
      </Card>
      <Link to="/" className="block"><Card className="p-3.5 flex items-center gap-3 active:bg-black/[0.03]"><span className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center"><Compass className="w-5 h-5" /></span><div className="flex-1 min-w-0"><p className="text-sm font-semibold">Explore SDM Technology</p><p className="text-xs text-muted-foreground">See the app as a visitor does</p></div><ChevronRight className="w-4 h-4 text-muted-foreground" /></Card></Link>
      <Heading>CRM</Heading>
      <div className="grid grid-cols-3 gap-3">{crm.map((t) => <Tile key={t.to} {...t} />)}</div>
      <Heading>Admin panel</Heading>
      <div className="grid grid-cols-3 gap-3">{panel.map((t) => <Tile key={t.to} {...t} />)}</div>
      <button onClick={async () => { await signOut(); navigate("/"); }} className="mt-6 w-full rounded-2xl border border-black/10 bg-white py-3 text-sm font-medium text-destructive flex items-center justify-center gap-2 active:bg-black/[0.03]"><LogOut className="w-4 h-4" />Log out</button>
    </AppShell>
  );
};

export default AppAdminHub;
