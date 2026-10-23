import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type P = { user_id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string; intern_id?: string | null; employee_id?: string | null; internship_domain?: string | null; [k: string]: any };
type Group = "visitor" | "intern" | "employee" | "admin";

const LABEL: Record<Group, string> = { visitor: "Website users", intern: "Interns", employee: "Employees", admin: "Admins" };

const PeopleManager = () => {
  const [people, setPeople] = useState<(P & { group: Group })[]>([]);
  const [tab, setTab] = useState<Group>("visitor");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profs }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      const byUser: Record<string, string[]> = {};
      (roles || []).forEach((r: any) => (byUser[r.user_id] = [...(byUser[r.user_id] || []), r.role]));
      const pick = (id: string): Group => {
        const r = byUser[id] || [];
        if (r.includes("admin")) return "admin";
        if (r.includes("employee")) return "employee";
        if (r.includes("intern")) return "intern";
        return "visitor";
      };
      setPeople(((profs as any[]) || []).map((p) => ({ ...p, group: pick(p.user_id) })));
      setLoading(false);
    })();
  }, []);

  const counts = useMemo(() => {
    const c: Record<Group, number> = { visitor: 0, intern: 0, employee: 0, admin: 0 };
    people.forEach((p) => c[p.group]++);
    return c;
  }, [people]);

  const list = people.filter((p) => p.group === tab && `${p.full_name} ${p.email} ${p.phone}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">People</h2>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LABEL) as Group[]).map((g) => (
          <button key={g} onClick={() => setTab(g)} className={`px-3 py-1.5 rounded-full text-sm border transition ${tab === g ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-muted"}`}>
            {LABEL[g]} ({counts[g]})
          </button>
        ))}
      </div>
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">No one in this list yet.</p>
      ) : (
        <div className="grid gap-2">
          {list.map((p) => (
            <div key={p.user_id} className="rounded-lg border border-border bg-card p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div>
                <p className="font-medium text-foreground">{p.full_name || "(no name)"}</p>
                <p className="text-muted-foreground">{p.email}{p.phone ? ` · ${p.phone}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.intern_id && <Badge variant="secondary">{p.intern_id}</Badge>}
                {p.employee_id && <Badge variant="secondary">{p.employee_id}</Badge>}
                {p.internship_domain && <Badge variant="outline">{p.internship_domain}</Badge>}
                <span className="text-xs text-muted-foreground">Joined {new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeopleManager;
