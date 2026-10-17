import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Wand2, Mail, Phone, GraduationCap, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CRMLayout from "@/components/crm/CRMLayout";
import PaymentAdmin from "@/components/crm/PaymentAdmin";
import ProgressPanel from "@/components/portal/ProgressPanel";
import PerformanceCharts from "@/components/analytics/PerformanceCharts";
import TaskManager from "@/components/crm/TaskManager";
import PlanAssigner from "@/components/crm/PlanAssigner";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { statusMeta } from "@/hooks/usePortalTasks";
import { DOMAIN_OPTIONS, MODES, durationText, fmtDate, currentWeek, missingFields } from "@/lib/internProfile";
import { planWeeks } from "@/data/internshipPlan";
import { pickRole } from "@/lib/roles";

const EDIT_FIELDS = ["full_name", "phone", "college", "city", "department", "position", "intern_id", "internship_domain", "internship_mode", "internship_start", "internship_end", "offer_role", "offer_date", "linkedin_url", "github_url", "skills", "bio", "employee_id"] as const;

const PersonProfilePage = () => {
  const { userId } = useParams();
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [p, setP] = useState<any>(null);
  const [personRole, setPersonRole] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState<any>({});
  const [assignOpen, setAssignOpen] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    const [pr, rl, tk, sb] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("tasks").select("*").eq("assigned_to", userId).order("week", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false }),
      supabase.from("task_submissions").select("*").eq("submitted_by", userId).order("submitted_at", { ascending: false }),
    ]);
    setP(pr.data);
    setPersonRole(pickRole(rl.data));
    setTasks(tk.data || []);
    setSubs(sb.data || []);
  }, [userId]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/auth");
    if (role !== "admin") return navigate("/crm/dashboard");
    load();
  }, [role, loading, user, load]);

  const openEdit = () => {
    const x: any = {};
    EDIT_FIELDS.forEach((k) => (x[k] = p?.[k] ?? ""));
    x.follows_company = !!p?.follows_company;
    x.joined_community = !!p?.joined_community;
    setF(x);
    setEdit(true);
  };

  const genId = async () => {
    const { data } = await supabase.from("profiles").select("intern_id").not("intern_id", "is", null);
    const max = (data || []).reduce((m: number, r: any) => {
      const n = /^SDM\/C\/(\d+)$/i.exec(r.intern_id || "");
      return n ? Math.max(m, Number(n[1])) : m;
    }, 0);
    setF((x: any) => ({ ...x, intern_id: `SDM/C/${String(max + 1).padStart(3, "0")}` }));
  };

  const save = async () => {
    const payload: any = {};
    EDIT_FIELDS.forEach((k) => { const v = String(f[k] ?? "").trim(); payload[k] = v === "" ? null : v; });
    payload.full_name = String(f.full_name || "").trim() || p.full_name;
    payload.follows_company = !!f.follows_company;
    payload.joined_community = !!f.joined_community;
    const { error } = await supabase.from("profiles").update(payload).eq("user_id", userId!);
    if (error) return toast({ title: "Could not save", description: error.message.includes("profiles_intern_id_uq") ? "That Intern ID is already used." : error.message, variant: "destructive" });
    toast({ title: "Profile updated" });
    setEdit(false);
    load();
  };

  if (loading || role !== "admin" || !p) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const isIntern = personRole === "intern";
  const miss = missingFields(p, personRole);
  const week = currentWeek(p);
  const done = tasks.filter((t) => t.status === "approved").length;
  const row = (label: string, value: any) => (
    <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium break-words">{value || "—"}</p></div>
  );
  const set = (k: string, v: string) => setF((x: any) => ({ ...x, [k]: v }));
  const inp = (k: string, label: string, props: any = {}) => (
    <div className="space-y-1.5"><Label>{label}</Label><Input value={f[k] ?? ""} onChange={(e) => set(k, e.target.value)} {...props} /></div>
  );

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/crm/employees"><ArrowLeft className="w-4 h-4 mr-1" />Back to people</Link></Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted border overflow-hidden flex items-center justify-center">
              {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-muted-foreground">{p.full_name?.[0]?.toUpperCase()}</span>}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">{p.full_name}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className="capitalize">{personRole || "normal user"}</Badge>
                {p.intern_id && <Badge variant="outline">{p.intern_id}</Badge>}
                {p.internship_domain && <Badge variant="secondary">{p.internship_domain}</Badge>}
                <Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge>
              </div>
              {isIntern && <p className="text-sm text-muted-foreground mt-1">Internship: {durationText(p)}{week && week > 0 ? ` · Week ${Math.min(week, planWeeks(p.internship_start, p.internship_end))} of ${planWeeks(p.internship_start, p.internship_end)}` : ""}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openEdit}><Pencil className="w-4 h-4 mr-2" />Edit profile</Button>
            {(isIntern || personRole === "employee") && <Button onClick={() => setAssignOpen(true)}>Assign from task library</Button>}
          </div>
        </div>

        {miss.length > 0 && (
          <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950/20"><CardContent className="pt-6 text-sm text-orange-700 dark:text-orange-300">
            Profile incomplete — missing: {miss.map((m) => m.label).join(", ")}. {isIntern && "The intern cannot open the portal until these are filled."}
          </CardContent></Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Profile details</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {row("Email", <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>)}
            {row("Phone", <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>)}
            {row("Date of birth", fmtDate(p.dob))}
            {row("College / University", p.college && <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" />{p.college}</span>)}
            {row("City", p.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</span>)}
            {row("Department", p.department)}
            {row("Position", p.position)}
            {row("Joined", fmtDate(p.created_at))}
            {isIntern && <>
              {row("Intern ID", p.intern_id)}
              {row("Internship domain", p.internship_domain)}
              {row("Role in offer letter", p.offer_role)}
              {row("Mode", p.internship_mode)}
              {row("Start date", fmtDate(p.internship_start))}
              {row("End date", fmtDate(p.internship_end))}
              {row("Offer letter date", fmtDate(p.offer_date))}
            </>}
            {row("LinkedIn", p.linkedin_url && <a className="text-primary underline inline-flex items-center gap-1" href={p.linkedin_url} target="_blank" rel="noreferrer"><Linkedin className="w-3 h-3" />open</a>)}
            {row("GitHub / Portfolio", p.github_url && <a className="text-primary underline inline-flex items-center gap-1" href={p.github_url} target="_blank" rel="noreferrer"><Github className="w-3 h-3" />open</a>)}
            {row("Skills", p.skills)}
            {row("Employee ID", p.employee_id)}
            {row("Follows company page", p.follows_company ? "Yes" : "No")}
            {row("Joined community", p.joined_community ? "Yes" : "No")}
            <div className="sm:col-span-2 lg:col-span-3">{row("Bio", p.bio)}</div>
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Progress</CardTitle></CardHeader>
            <CardContent><ProgressPanel tasks={tasks} totalWeeks={planWeeks(p.internship_start, p.internship_end)} /></CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Tasks ({done}/{tasks.length} approved · {subs.length} submissions)</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskManager person={{ user_id: p.user_id, full_name: p.full_name, email: p.email, role: personRole, internship_domain: p.internship_domain }} tasks={tasks} onChange={load} />
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Performance analytics</h2>
            <PerformanceCharts tasks={tasks} subs={subs} />
          </div>
        )}

        {isIntern && (
          <Card>
            <CardHeader><CardTitle className="text-base">Payments (admin only)</CardTitle></CardHeader>
            <CardContent><PaymentAdmin userId={userId} /></CardContent>
          </Card>
        )}
      </div>

      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>Edit {p.full_name}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {inp("full_name", "Full name")}
            {inp("phone", "Phone")}
            {inp("college", "College / University")}
            {inp("city", "City")}
            {inp("department", "Department")}
            {inp("position", "Position")}
            <div className="space-y-1.5"><Label>Intern ID</Label>
              <div className="flex gap-2"><Input value={f.intern_id ?? ""} onChange={(e) => set("intern_id", e.target.value)} placeholder="SDM/C/001" />
                <Button type="button" variant="outline" size="icon" title="Generate next ID" onClick={genId}><Wand2 className="w-4 h-4" /></Button></div>
            </div>
            <div className="space-y-1.5"><Label>Internship domain</Label>
              <Select value={f.internship_domain || ""} onValueChange={(v) => set("internship_domain", v)}>
                <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                <SelectContent>{DOMAIN_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {inp("offer_role", "Role in offer letter")}
            <div className="space-y-1.5"><Label>Mode</Label>
              <Select value={f.internship_mode || ""} onValueChange={(v) => set("internship_mode", v)}>
                <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>{MODES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {inp("internship_start", "Start date", { type: "date" })}
            {inp("internship_end", "End date", { type: "date" })}
            {inp("offer_date", "Offer letter date", { type: "date" })}
            {inp("linkedin_url", "LinkedIn URL")}
            {inp("github_url", "GitHub / Portfolio URL")}
            {inp("skills", "Skills")}
            {inp("employee_id", "Employee ID")}
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={!!f.follows_company} onCheckedChange={(v) => setF((x: any) => ({ ...x, follows_company: !!v }))} />Follows company LinkedIn page</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={!!f.joined_community} onCheckedChange={(v) => setF((x: any) => ({ ...x, joined_community: !!v }))} />Joined community</label>
          </div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={3} value={f.bio ?? ""} onChange={(e) => set("bio", e.target.value)} /></div>
          <Button onClick={save} className="w-full">Save changes</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>Assign tasks to {p.full_name}</DialogTitle></DialogHeader>
          <PlanAssigner people={[{ email: p.email, user_id: p.user_id, full_name: p.full_name, role: personRole || undefined, internship_domain: p.internship_domain, internship_start: p.internship_start, internship_end: p.internship_end }]} onDone={() => { setAssignOpen(false); load(); }} />
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
};
export default PersonProfilePage;
