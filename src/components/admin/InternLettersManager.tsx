import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LetterAccess, defaultAccess, letterBlockers, registerCompletion, saveAccess } from "@/lib/internLetters";

type Filter = "all" | "ready" | "incomplete" | "offer" | "completion";

/** One list for every intern: profile status plus lock/unlock switches for both letters. */
const InternLettersManager = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<{ p: any; a: LetterAccess }[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    const db = supabase as any;
    const { data: roles } = await db.from("user_roles").select("user_id").eq("role", "intern");
    const ids = (roles || []).map((r: any) => r.user_id);
    if (!ids.length) { setRows([]); setLoading(false); return; }
    const [{ data: ps }, { data: acc }] = await Promise.all([
      db.from("profiles").select("*").in("user_id", ids),
      db.from("letter_access").select("*").in("user_id", ids),
    ]);
    const am: Record<string, LetterAccess> = {};
    (acc || []).forEach((x: any) => (am[x.user_id] = x));
    setRows((ps || []).map((p: any) => ({ p, a: { ...defaultAccess(p.user_id), ...(am[p.user_id] || {}) } })).sort((x: any, y: any) => String(x.p.full_name).localeCompare(String(y.p.full_name))));
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const set = async (p: any, a: LetterAccess, completionOn = false) => {
    if (completionOn) await registerCompletion(p, a);
    await saveAccess(a);
  };
  const flip = async (p: any, a: LetterAccess, k: "offer_unlocked" | "completion_unlocked", v: boolean) => {
    setBusy(p.user_id);
    try { await set(p, { ...a, [k]: v }, k === "completion_unlocked" && v); await load(); }
    catch (e: any) { toast({ title: "Could not save", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };
  const bulk = async (k: "offer_unlocked" | "completion_unlocked") => {
    const targets = rows.filter(({ p, a }) => letterBlockers(p).length === 0 && !a[k] && (k === "offer_unlocked" || (p.internship_end && new Date(p.internship_end) < new Date())));
    if (!targets.length) return toast({ title: "Nothing to unlock", description: k === "offer_unlocked" ? "No complete profile is waiting." : "No complete profile with an ended internship is waiting." });
    if (!confirm(`Unlock the ${k === "offer_unlocked" ? "offer" : "completion"} letter for ${targets.length} intern(s)?`)) return;
    setBusy("bulk");
    try { for (const { p, a } of targets) await set(p, { ...a, [k]: true }, k === "completion_unlocked"); toast({ title: `${targets.length} letter(s) unlocked` }); await load(); }
    catch (e: any) { toast({ title: "Stopped", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };

  const list = useMemo(() => rows.filter(({ p, a }) => {
    const text = `${p.full_name} ${p.intern_id} ${p.internship_domain}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    const ok = letterBlockers(p).length === 0;
    return filter === "all" || (filter === "ready" && ok) || (filter === "incomplete" && !ok) || (filter === "offer" && a.offer_unlocked) || (filter === "completion" && a.completion_unlocked);
  }), [rows, q, filter]);
  const ready = rows.filter(({ p }) => letterBlockers(p).length === 0).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Intern letters</h2>
        <p className="text-sm text-muted-foreground">Offer and completion letters are created from each intern's profile and appear in their portal under "My Letters" once you unlock them. Letters are not created while a profile is incomplete.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative"><Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" /><Input className="pl-8 w-56" placeholder="Search name, ID, domain" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {([["all", `All (${rows.length})`], ["ready", `Profile complete (${ready})`], ["incomplete", `Profile incomplete (${rows.length - ready})`], ["offer", "Offer unlocked"], ["completion", "Completion unlocked"]] as [Filter, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-sm border ${filter === k ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{label}</button>
        ))}
        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="outline" disabled={busy === "bulk"} onClick={() => bulk("offer_unlocked")}>Unlock all offer letters (complete profiles)</Button>
          <Button size="sm" variant="outline" disabled={busy === "bulk"} onClick={() => bulk("completion_unlocked")}>Unlock completion letters (internship ended)</Button>
        </div>
      </div>
      {loading ? <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading…</p> : (
        <div className="rounded-xl border border-border divide-y divide-border bg-card">
          {list.length === 0 && <p className="p-4 text-sm text-muted-foreground">No interns match.</p>}
          {list.map(({ p, a }) => {
            const miss = letterBlockers(p);
            const ok = miss.length === 0;
            return (
              <div key={p.user_id} className="p-3 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex-1 min-w-[200px]">
                  <Link to={`/crm/people/${p.user_id}`} className="font-medium hover:underline">{p.full_name}</Link>
                  <div className="text-xs text-muted-foreground">{p.intern_id || "No Intern ID"} · {p.internship_domain || "Domain not set"}</div>
                  {!ok && <div className="text-xs text-orange-600">Profile incomplete: {miss.slice(0, 3).join(", ")}{miss.length > 3 ? ` +${miss.length - 3} more` : ""}</div>}
                </div>
                <label className="flex items-center gap-2"><Switch disabled={!ok || busy === p.user_id} checked={a.offer_unlocked} onCheckedChange={(v) => flip(p, a, "offer_unlocked", v)} />Offer</label>
                <label className="flex items-center gap-2"><Switch disabled={!ok || busy === p.user_id} checked={a.completion_unlocked} onCheckedChange={(v) => flip(p, a, "completion_unlocked", v)} />Completion</label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default InternLettersManager;
