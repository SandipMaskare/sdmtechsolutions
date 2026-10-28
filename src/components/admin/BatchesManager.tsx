import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BellRing, CheckCircle2, ExternalLink, Layers, Loader2, Pencil, Plus, Search, Sparkles, Trash2, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DOMAIN_OPTIONS, MODES, fmtDate, missingFields, weeksBetween } from "@/lib/internProfile";
import { findDomain } from "@/data/internshipPlan";
import { PORTAL_URL, notifyUser } from "@/lib/notify";

type Intern = {
  user_id: string; full_name: string | null; email: string | null; phone: string | null; college: string | null; city: string | null;
  intern_id: string | null; internship_domain: string | null; internship_mode: string | null; internship_start: string | null; internship_end: string | null;
  linkedin_url: string | null; follows_company: boolean | null; offer_role: string | null;
};
type Batch = { id: string; name: string; domain: string; start_date: string | null; end_date: string | null; mentor: string | null; notes: string | null };

const db = supabase as any;
const NONE = "__none";
const domKey = (t?: string | null) => findDomain(t)?.key || "";
const monthYear = (d?: string | null) => (d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "");
const batchName = (domain: string, start?: string | null) => `${domain}${start ? " · " + monthYear(start) : ""}`;

const status = (b: Batch) => {
  const now = new Date().toISOString().slice(0, 10);
  if (b.start_date && now < b.start_date) return { label: "Upcoming", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300" };
  if (b.end_date && now > b.end_date) return { label: "Completed", cls: "bg-slate-500/15 text-slate-600 dark:text-slate-300" };
  return { label: "Running", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" };
};

const BatchesManager = () => {
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [member, setMember] = useState<Record<string, string>>({}); // user_id -> batch_id
  const [lastRemind, setLastRemind] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [openBatch, setOpenBatch] = useState<string | null>(null); // batch id, "all" or null (overview)
  const [editBatch, setEditBatch] = useState<Partial<Batch> | null>(null);
  const [edit, setEdit] = useState<Intern | null>(null);

  const load = useCallback(async () => {
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "intern");
    const ids = (roles || []).map((r: any) => r.user_id);
    const [ps, bs, ms, rs] = await Promise.all([
      ids.length ? supabase.from("profiles").select("user_id, full_name, email, phone, college, city, intern_id, internship_domain, internship_mode, internship_start, internship_end, linkedin_url, follows_company, offer_role").in("user_id", ids) : Promise.resolve({ data: [] as any[] }),
      db.from("batches").select("*").order("start_date", { ascending: false }),
      db.from("batch_members").select("batch_id, user_id"),
      db.from("profile_reminders").select("user_id, sent_at").order("sent_at", { ascending: false }).limit(2000),
    ]);
    setInterns(((ps.data as any[]) || []).sort((a, b) => String(a.full_name).localeCompare(String(b.full_name))));
    setBatches((bs.data as Batch[]) || []);
    const m: Record<string, string> = {};
    ((ms.data as any[]) || []).forEach((x) => (m[x.user_id] = x.batch_id));
    setMember(m);
    const lr: Record<string, string> = {};
    ((rs.data as any[]) || []).forEach((x) => { if (!lr[x.user_id]) lr[x.user_id] = x.sent_at; });
    setLastRemind(lr);
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const incomplete = (p: Intern) => missingFields(p, "intern");
  const unbatched = interns.filter((p) => !member[p.user_id]);
  const groups = useMemo(() => {
    const g: Record<string, { domain: string; start: string; end: string; users: Intern[] }> = {};
    unbatched.forEach((p) => {
      const dk = domKey(p.internship_domain);
      if (!dk || !p.internship_start || !p.internship_end) return;
      const k = `${dk}|${p.internship_start}|${p.internship_end}`;
      (g[k] ||= { domain: findDomain(p.internship_domain)!.label, start: p.internship_start, end: p.internship_end, users: [] }).users.push(p);
    });
    return Object.values(g).sort((a, b) => b.users.length - a.users.length);
  }, [unbatched]);

  const addMembers = async (batchId: string, userIds: string[]) => {
    if (!userIds.length) return 0;
    const { error } = await db.from("batch_members").upsert(userIds.map((u) => ({ batch_id: batchId, user_id: u })), { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return userIds.length;
  };
  const matching = (b: Pick<Batch, "domain" | "start_date" | "end_date">) =>
    interns.filter((p) => !member[p.user_id] && domKey(p.internship_domain) === domKey(b.domain) && p.internship_start === b.start_date && p.internship_end === b.end_date);

  const saveBatch = async (b: Partial<Batch>, autoAdd: boolean) => {
    if (!b.domain || !b.start_date || !b.end_date) { toast({ title: "Choose a domain and both dates", variant: "destructive" }); return; }
    if (b.end_date < b.start_date) { toast({ title: "End date is before the start date", variant: "destructive" }); return; }
    const row = { name: (b.name || "").trim() || batchName(b.domain, b.start_date), domain: b.domain, start_date: b.start_date, end_date: b.end_date, mentor: b.mentor || null, notes: b.notes || null };
    try {
      let id = b.id;
      if (id) { const { error } = await db.from("batches").update(row).eq("id", id); if (error) throw new Error(error.message); }
      else { const { data, error } = await db.from("batches").insert(row).select("id").single(); if (error) throw new Error(error.message); id = data.id; }
      let added = 0;
      if (autoAdd && id) added = await addMembers(id, matching({ domain: row.domain, start_date: row.start_date, end_date: row.end_date }).map((p) => p.user_id));
      toast({ title: b.id ? "Batch updated" : "Batch created", description: autoAdd ? `${added} intern(s) added automatically.` : undefined });
      setEditBatch(null);
      await load();
    } catch (e: any) { toast({ title: "Could not save the batch", description: e?.message, variant: "destructive" }); }
  };
  const deleteBatch = async (b: Batch) => {
    if (!window.confirm(`Delete the batch "${b.name}"? The interns stay; only the grouping is removed.`)) return;
    const { error } = await db.from("batches").delete().eq("id", b.id);
    if (error) toast({ title: "Could not delete", description: error.message, variant: "destructive" });
    else { if (openBatch === b.id) setOpenBatch(null); await load(); }
  };
  const autoFill = async (b: Batch) => {
    try { const n = await addMembers(b.id, matching(b).map((p) => p.user_id)); toast({ title: n ? `${n} intern(s) added to ${b.name}` : "No unbatched intern matches this domain and dates" }); await load(); }
    catch (e: any) { toast({ title: "Could not add", description: e?.message, variant: "destructive" }); }
  };

  const setBatchFor = async (userIds: string[], batchId: string | null) => {
    try {
      if (batchId) await addMembers(batchId, userIds);
      else { const { error } = await db.from("batch_members").delete().in("user_id", userIds); if (error) throw new Error(error.message); }
      await load();
    } catch (e: any) { toast({ title: "Could not update the batch", description: e?.message, variant: "destructive" }); }
  };

  const sendReminders = async (list: Intern[], skipRecent: boolean) => {
    const day = 86400000;
    const targets = list.filter((p) => incomplete(p).length && p.email && (!skipRecent || !lastRemind[p.user_id] || Date.now() - new Date(lastRemind[p.user_id]).getTime() > day));
    if (!targets.length) { toast({ title: "Nobody to remind", description: "Everyone selected is complete, has no email, or was reminded in the last 24 hours." }); return; }
    if (!window.confirm(`Send a profile reminder email to ${targets.length} intern(s)?`)) return;
    const { data: u } = await supabase.auth.getUser();
    let ok = 0; const failed: string[] = [];
    for (const p of targets) {
      const miss = incomplete(p);
      const { error } = await notifyUser({
        email: p.email!, name: p.full_name || undefined, template: "intern",
        subject: "Action needed: complete your SDM Technology intern profile",
        lines: [
          "Your intern profile is not complete yet. Until it is complete you cannot open your portal, so you cannot see your tasks or download your letters.",
          "Please add the following details:",
          ...miss.map((f) => "• " + f.label),
          "It takes only a few minutes. Log in and open the Profile page to finish it.",
        ],
        link: { label: "Complete my profile", url: PORTAL_URL + "/profile" },
      });
      if (error) failed.push(`${p.full_name || p.email}: ${error}`);
      else {
        ok++;
        await db.from("profile_reminders").insert({ user_id: p.user_id, sent_by: u.user?.id || null, missing: miss.map((f) => f.label).join(", ") });
      }
    }
    toast({ title: `${ok} reminder(s) sent`, description: failed.length ? `${failed.length} failed. First error: ${failed[0]}` : undefined, variant: failed.length ? "destructive" : "default" });
    await load();
  };

  if (loading) return <p className="text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading batches…</p>;

  const current = openBatch && openBatch !== "all" ? batches.find((b) => b.id === openBatch) : null;
  const panelList = openBatch === "all" ? interns : current ? interns.filter((p) => member[p.user_id] === current.id) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> Batches &amp; interns</h2>
          <p className="text-sm text-muted-foreground">Group interns by domain and internship dates, manage every profile in one place and send profile reminders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={openBatch === "all" ? "default" : "outline"} onClick={() => setOpenBatch(openBatch === "all" ? null : "all")}><Users className="w-4 h-4 mr-1" /> All interns</Button>
          <Button onClick={() => setEditBatch({ start_date: "", end_date: "" })}><Plus className="w-4 h-4 mr-1" /> New batch</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Interns", v: interns.length, c: "from-teal-500 to-emerald-500" },
          { l: "In a batch", v: interns.length - unbatched.length, c: "from-sky-500 to-indigo-500" },
          { l: "Not in a batch", v: unbatched.length, c: "from-amber-500 to-orange-500" },
          { l: "Profile incomplete", v: interns.filter((p) => incomplete(p).length).length, c: "from-rose-500 to-pink-500" },
        ].map((s) => (
          <div key={s.l} className={`rounded-2xl p-4 text-white bg-gradient-to-br shadow-sm ${s.c}`}>
            <p className="text-3xl font-bold leading-none">{s.v}</p>
            <p className="text-xs mt-1 opacity-90">{s.l}</p>
          </div>
        ))}
      </div>

      {!openBatch && groups.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-medium text-foreground flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-primary" /> Suggested batches from intern profiles</p>
          <p className="text-sm text-muted-foreground mb-3">These interns share the same domain and dates but are not in a batch yet. One click creates the batch and adds them.</p>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <Button key={g.domain + g.start + g.end} variant="outline" size="sm" onClick={() => saveBatch({ domain: g.domain, start_date: g.start, end_date: g.end, name: batchName(g.domain, g.start) }, true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> {g.domain} · {fmtDate(g.start)} – {fmtDate(g.end)} ({g.users.length})
              </Button>
            ))}
          </div>
        </div>
      )}

      {!openBatch && (
        batches.length === 0 ? (
          <p className="text-muted-foreground">No batches yet. Create one with “New batch”, or use a suggestion above.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {batches.map((b) => {
              const ms = interns.filter((p) => member[p.user_id] === b.id);
              const done = ms.filter((p) => !incomplete(p).length).length;
              const st = status(b);
              const w = weeksBetween(b.start_date, b.end_date);
              return (
                <div key={b.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.domain}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{fmtDate(b.start_date)} – {fmtDate(b.end_date)}{w ? ` · ${w} weeks` : ""}{b.mentor ? ` · Mentor: ${b.mentor}` : ""}</p>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{ms.length} intern(s)</span><span>{done}/{ms.length} profiles complete</span></div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all" style={{ width: ms.length ? `${(done / ms.length) * 100}%` : "0%" }} /></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button size="sm" onClick={() => setOpenBatch(b.id)}>Open</Button>
                    <Button size="sm" variant="outline" onClick={() => autoFill(b)}><Sparkles className="w-3.5 h-3.5 mr-1" /> Auto-add</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditBatch(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="outline" onClick={() => deleteBatch(b)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {openBatch && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground">{openBatch === "all" ? "All interns" : current?.name}</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpenBatch(null)}><X className="w-4 h-4 mr-1" /> Back to batches</Button>
          </div>
          {current && <p className="text-sm text-muted-foreground">{current.domain} · {fmtDate(current.start_date)} – {fmtDate(current.end_date)}</p>}
          <InternPanel list={panelList} batches={batches} member={member} lastRemind={lastRemind} incomplete={incomplete}
            onBatch={setBatchFor} onRemind={sendReminders} onEdit={setEdit} scopeBatch={current?.id} />
        </div>
      )}

      <BatchDialog value={editBatch} onClose={() => setEditBatch(null)} onSave={saveBatch} matchCount={(b) => matching(b as any).length} />
      <EditInternDialog intern={edit} onClose={() => setEdit(null)} onSaved={async () => { setEdit(null); await load(); }} />
    </div>
  );
};

/* ---------- table of interns with filters, bulk actions and reminders ---------- */
const InternPanel = ({ list, batches, member, lastRemind, incomplete, onBatch, onRemind, onEdit, scopeBatch }: {
  list: Intern[]; batches: Batch[]; member: Record<string, string>; lastRemind: Record<string, string>;
  incomplete: (p: Intern) => { key: string; label: string }[];
  onBatch: (ids: string[], batchId: string | null) => Promise<void>;
  onRemind: (list: Intern[], skipRecent: boolean) => Promise<void>;
  onEdit: (p: Intern) => void; scopeBatch?: string;
}) => {
  const [q, setQ] = useState("");
  const [dom, setDom] = useState("all");
  const [state, setState] = useState<"all" | "incomplete" | "complete">("all");
  const [bf, setBf] = useState("all");
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [skipRecent, setSkipRecent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<string>(NONE);

  const shown = useMemo(() => list.filter((p) => {
    if (q && !`${p.full_name} ${p.email} ${p.intern_id} ${p.college} ${p.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (dom !== "all" && domKey(p.internship_domain) !== dom) return false;
    if (state === "incomplete" && !incomplete(p).length) return false;
    if (state === "complete" && incomplete(p).length) return false;
    if (!scopeBatch) {
      if (bf === "none" && member[p.user_id]) return false;
      if (bf !== "all" && bf !== "none" && member[p.user_id] !== bf) return false;
    }
    return true;
  }), [list, q, dom, state, bf, member, scopeBatch]);

  const chosen = shown.filter((p) => sel[p.user_id]);
  const doms = Array.from(new Set(list.map((p) => domKey(p.internship_domain)).filter(Boolean)));
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };
  const incShown = shown.filter((p) => incomplete(p).length);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative w-full sm:w-64"><Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" placeholder="Search name, email, ID, college" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select value={dom} onValueChange={setDom}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Domain" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All domains</SelectItem>{doms.map((d) => <SelectItem key={d} value={d}>{findDomain(d)?.label || d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={state} onValueChange={(v) => setState(v as any)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Any profile</SelectItem><SelectItem value="incomplete">Incomplete only</SelectItem><SelectItem value="complete">Complete only</SelectItem></SelectContent>
        </Select>
        {!scopeBatch && (
          <Select value={bf} onValueChange={setBf}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Any batch</SelectItem><SelectItem value="none">Not in a batch</SelectItem>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10 p-3 flex flex-wrap items-center gap-2">
        <BellRing className="w-4 h-4 text-rose-600" />
        <span className="text-sm font-medium text-foreground mr-2">Profile reminders</span>
        <Button size="sm" disabled={busy || !chosen.length} onClick={() => run(() => onRemind(chosen, skipRecent))}>Send to selected ({chosen.length})</Button>
        <Button size="sm" variant="outline" disabled={busy || !incShown.length} onClick={() => run(() => onRemind(incShown, skipRecent))}>Send to all incomplete shown ({incShown.length})</Button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground ml-auto"><Checkbox checked={skipRecent} onCheckedChange={(v) => setSkipRecent(v === true)} /> Skip those reminded in the last 24 hours</label>
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Button size="sm" variant="ghost" onClick={() => setSel(Object.fromEntries(shown.map((p) => [p.user_id, true])))}>Select all shown ({shown.length})</Button>
        <Button size="sm" variant="ghost" onClick={() => setSel({})}>Clear</Button>
        <span className="text-muted-foreground">|</span>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="w-52 h-8"><SelectValue placeholder="Move selected to…" /></SelectTrigger>
          <SelectContent><SelectItem value={NONE}>Move selected to…</SelectItem>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="sm" variant="outline" disabled={busy || !chosen.length || target === NONE} onClick={() => run(async () => { await onBatch(chosen.map((p) => p.user_id), target); setSel({}); setTarget(NONE); })}>Move</Button>
        <Button size="sm" variant="outline" disabled={busy || !chosen.length} onClick={() => run(async () => { await onBatch(chosen.map((p) => p.user_id), null); setSel({}); })}>Remove from batch</Button>
      </div>

      {shown.length === 0 ? <p className="text-muted-foreground py-6 text-center">No interns match.</p> : (
        <div className="rounded-2xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="p-3 w-8"></th><th className="p-3">Intern</th><th className="p-3">Intern ID</th><th className="p-3">Domain</th><th className="p-3">Dates</th><th className="p-3">Batch</th><th className="p-3">Profile</th><th className="p-3">Last reminder</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {shown.map((p) => {
                const miss = incomplete(p);
                const b = batches.find((x) => x.id === member[p.user_id]);
                return (
                  <tr key={p.user_id} className="border-t border-border align-top">
                    <td className="p-3"><Checkbox checked={!!sel[p.user_id]} onCheckedChange={(v) => setSel((s) => ({ ...s, [p.user_id]: v === true }))} /></td>
                    <td className="p-3"><p className="font-medium text-foreground">{p.full_name || "(no name)"}</p><p className="text-xs text-muted-foreground">{p.email}{p.phone ? ` · ${p.phone}` : ""}</p>{p.college && <p className="text-xs text-muted-foreground">{p.college}</p>}</td>
                    <td className="p-3 whitespace-nowrap">{p.intern_id || <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-3">{p.internship_domain || <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-3 whitespace-nowrap text-xs">{p.internship_start ? `${fmtDate(p.internship_start)} – ${fmtDate(p.internship_end)}` : "—"}</td>
                    <td className="p-3 min-w-[150px]">
                      <Select value={b?.id || NONE} onValueChange={(v) => void onBatch([p.user_id], v === NONE ? null : v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value={NONE}>No batch</SelectItem>{batches.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      {miss.length === 0 ? <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</Badge>
                        : <span title={miss.map((m) => m.label).join("\n")}><Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/15"><AlertTriangle className="w-3 h-3 mr-1" /> {miss.length} missing</Badge></span>}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{lastRemind[p.user_id] ? fmtDate(lastRemind[p.user_id]) : "—"}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onEdit(p)} title="Edit profile"><Pencil className="w-3.5 h-3.5" /></Button>
                        {miss.length > 0 && <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => onRemind([p], false))} title="Send reminder to this intern"><BellRing className="w-3.5 h-3.5" /></Button>}
                        <Button size="sm" variant="outline" asChild title="Open full profile"><Link to={`/crm/people/${p.user_id}`}><ExternalLink className="w-3.5 h-3.5" /></Link></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ---------- create / edit a batch ---------- */
const BatchDialog = ({ value, onClose, onSave, matchCount }: { value: Partial<Batch> | null; onClose: () => void; onSave: (b: Partial<Batch>, autoAdd: boolean) => void; matchCount: (b: Partial<Batch>) => number }) => {
  const [b, setB] = useState<Partial<Batch>>({});
  const [auto, setAuto] = useState(true);
  useEffect(() => { if (value) { setB(value); setAuto(!value.id); } }, [value]);
  if (!value) return null;
  const n = b.domain && b.start_date && b.end_date ? matchCount(b) : 0;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{value.id ? "Edit batch" : "New batch"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Domain</Label>
            <Select value={b.domain || ""} onValueChange={(v) => setB({ ...b, domain: v })}>
              <SelectTrigger><SelectValue placeholder="Choose a domain" /></SelectTrigger>
              <SelectContent>{DOMAIN_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start date</Label><Input type="date" value={b.start_date || ""} onChange={(e) => setB({ ...b, start_date: e.target.value })} /></div>
            <div><Label>End date</Label><Input type="date" value={b.end_date || ""} onChange={(e) => setB({ ...b, end_date: e.target.value })} /></div>
          </div>
          <div><Label>Batch name (optional)</Label><Input placeholder={b.domain ? batchName(b.domain, b.start_date) : "e.g. Full Stack · Nov 2026"} value={b.name || ""} onChange={(e) => setB({ ...b, name: e.target.value })} /></div>
          <div><Label>Mentor (optional)</Label><Input value={b.mentor || ""} onChange={(e) => setB({ ...b, mentor: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={auto} onCheckedChange={(v) => setAuto(v === true)} /> Add interns whose profile has this domain and these exact dates{n ? ` (${n} match)` : ""}</label>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(b, auto)}>{value.id ? "Save" : "Create batch"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ---------- edit one intern's profile without leaving the page ---------- */
const EditInternDialog = ({ intern, onClose, onSaved }: { intern: Intern | null; onClose: () => void; onSaved: () => void }) => {
  const { toast } = useToast();
  const [f, setF] = useState<Partial<Intern>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (intern) setF(intern); }, [intern]);
  if (!intern) return null;
  const set = (k: keyof Intern) => (e: any) => setF({ ...f, [k]: e.target.value });
  const save = async () => {
    setSaving(true);
    const clean = (v?: string | null) => (v && String(v).trim() ? String(v).trim() : null);
    const { error } = await supabase.from("profiles").update({
      full_name: clean(f.full_name), phone: clean(f.phone), college: clean(f.college), city: clean(f.city), intern_id: clean(f.intern_id),
      internship_domain: clean(f.internship_domain), internship_mode: clean(f.internship_mode), internship_start: clean(f.internship_start), internship_end: clean(f.internship_end),
      linkedin_url: clean(f.linkedin_url), offer_role: clean(f.offer_role),
    } as any).eq("user_id", intern.user_id);
    setSaving(false);
    if (error) toast({ title: "Could not save", description: error.message, variant: "destructive" });
    else { toast({ title: "Profile saved" }); onSaved(); }
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {intern.full_name || "intern"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Full name</Label><Input value={f.full_name || ""} onChange={set("full_name")} /></div>
          <div><Label>Phone</Label><Input value={f.phone || ""} onChange={set("phone")} /></div>
          <div><Label>College / University</Label><Input value={f.college || ""} onChange={set("college")} /></div>
          <div><Label>City</Label><Input value={f.city || ""} onChange={set("city")} /></div>
          <div><Label>Intern ID</Label><Input value={f.intern_id || ""} onChange={set("intern_id")} /></div>
          <div><Label>Offer role</Label><Input value={f.offer_role || ""} onChange={set("offer_role")} /></div>
          <div><Label>Internship domain</Label>
            <Select value={f.internship_domain || NONE} onValueChange={(v) => setF({ ...f, internship_domain: v === NONE ? null : v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={NONE}>Not set</SelectItem>{DOMAIN_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}{f.internship_domain && !DOMAIN_OPTIONS.includes(f.internship_domain) && <SelectItem value={f.internship_domain}>{f.internship_domain}</SelectItem>}</SelectContent>
            </Select>
          </div>
          <div><Label>Mode</Label>
            <Select value={f.internship_mode || NONE} onValueChange={(v) => setF({ ...f, internship_mode: v === NONE ? null : v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={NONE}>Not set</SelectItem>{MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Start date</Label><Input type="date" value={f.internship_start || ""} onChange={set("internship_start")} /></div>
          <div><Label>End date</Label><Input type="date" value={f.internship_end || ""} onChange={set("internship_end")} /></div>
          <div className="sm:col-span-2"><Label>LinkedIn profile link</Label><Input value={f.linkedin_url || ""} onChange={set("linkedin_url")} /></div>
        </div>
        <p className="text-xs text-muted-foreground">Email cannot be changed here. The intern confirms “follows the company page” themselves.</p>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchesManager;
