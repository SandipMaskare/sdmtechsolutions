import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { verifyUrl } from "@/lib/qr";

interface Cert { cert_id: string; holder_name: string; role: string; issued_on: string | null; status: "valid" | "revoked" }

/** Every issued letter is listed here. Revoke one and its verify page shows "revoked". */
const VerificationRegister = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Cert[]>([]);
  const [q, setQ] = useState("");
  const load = useCallback(async () => {
    const { data } = await (supabase as any).from("certificates").select("cert_id,holder_name,role,issued_on,status").order("created_at", { ascending: false }).limit(300);
    setRows((data as unknown as Cert[]) || []);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const toggle = async (c: Cert) => {
    const next = c.status === "valid" ? "revoked" : "valid";
    if (next === "revoked" && !confirm(`Revoke ${c.holder_name}'s letter? Its verify page will say it is no longer valid.`)) return;
    const { error } = await (supabase as any).from("certificates").update({ status: next, updated_at: new Date().toISOString() }).eq("cert_id", c.cert_id);
    if (error) toast({ title: "Could not update", description: error.message, variant: "destructive" });
    else void load();
  };
  const list = rows.filter((r) => !q || `${r.holder_name} ${r.cert_id} ${r.role}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-semibold flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-primary" />Verification register ({rows.length})</h3>
      <p className="text-xs text-muted-foreground mb-2">Letters are added here automatically when you download or email them. Anyone can confirm them at sdmtechsolution.com/verify.</p>
      <div className="relative mb-2"><Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" /><Input className="pl-8" placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="divide-y divide-border max-h-80 overflow-auto">
        {list.length === 0 && <p className="text-sm text-muted-foreground py-2">Nothing here yet.</p>}
        {list.map((c) => (
          <div key={c.cert_id} className="py-2 flex items-center gap-2 text-sm">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{c.holder_name}</div>
              <div className="text-xs text-muted-foreground truncate">{c.cert_id} · {c.role}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.status === "valid" ? "Valid" : "Revoked"}</span>
            <a href={verifyUrl(c.cert_id)} target="_blank" rel="noreferrer" title="Open verify page"><Button size="icon" variant="ghost" className="h-8 w-8"><ExternalLink className="w-4 h-4" /></Button></a>
            <Button size="sm" variant="outline" onClick={() => toggle(c)}>{c.status === "valid" ? "Revoke" : "Reinstate"}</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VerificationRegister;
