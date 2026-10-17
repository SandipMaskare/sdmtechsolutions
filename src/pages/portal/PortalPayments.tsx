import { useCallback, useEffect, useState } from "react";
import { Upload, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout, { PortalKind } from "@/components/portal/PortalLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase as typedClient } from "@/integrations/supabase/client";

// the generated types predate the payments table
const supabase: any = typedClient;
import { useToast } from "@/hooks/use-toast";
import { fmtDate } from "@/lib/internProfile";

export const paymentMeta: Record<string, { label: string; className: string }> = {
  requested: { label: "Payment due", className: "bg-orange-500" },
  submitted: { label: "Awaiting verification", className: "bg-blue-500" },
  verified: { label: "Verified", className: "bg-green-600" },
  rejected: { label: "Rejected – resubmit", className: "bg-red-500" },
  waived: { label: "Waived", className: "bg-slate-500" },
};

const PortalPayments = ({ kind }: { kind: PortalKind }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState<Record<string, string>>({});
  const [file, setFile] = useState<Record<string, File | null>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const submit = async (p: any) => {
    const r = (ref[p.id] || "").trim();
    if (r.length < 6) return toast({ title: "Enter the transaction / UTR number", variant: "destructive" });
    setBusy(p.id);
    let proof: string | null = null;
    const f = file[p.id];
    if (f) {
      const path = `${user!.id}/${p.id}-${Date.now()}.${f.name.split(".").pop()}`;
      const up = await supabase.storage.from("payment-proofs").upload(path, f);
      if (up.error) { setBusy(null); return toast({ title: "Upload failed", description: up.error.message, variant: "destructive" }); }
      proof = path;
    }
    const { error } = await supabase.rpc("submit_payment_proof", { _id: p.id, _ref: r, _proof: proof });
    setBusy(null);
    if (error) return toast({ title: "Could not submit", description: error.message, variant: "destructive" });
    toast({ title: "Submitted", description: "The admin will verify your payment." });
    load();
  };

  return (
    <PortalLayout kind={kind}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Payments (such as document verification) are set by the admin. Pay as instructed, then enter the transaction number here.</p>
        </div>
        {loading ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" /> : rows.length === 0 ? (
          <Card><CardContent className="pt-6 text-muted-foreground flex items-center gap-3"><Wallet className="w-5 h-5" />Nothing to pay right now. If a payment is assigned to you, it will appear here.</CardContent></Card>
        ) : rows.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <p className="text-2xl font-bold mt-1">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground">Assigned {fmtDate(p.created_at)}</p>
              </div>
              <Badge className={paymentMeta[p.status]?.className}>{paymentMeta[p.status]?.label || p.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.instructions && <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">{p.instructions}</div>}
              {p.admin_note && <p className="text-sm"><span className="font-medium">Admin note:</span> {p.admin_note}</p>}
              {p.reference && <p className="text-sm text-muted-foreground">Your reference: {p.reference}</p>}
              {["requested", "rejected"].includes(p.status) && (
                <div className="space-y-3 border-t pt-3">
                  <div className="space-y-1.5"><Label>Transaction / UTR number</Label><Input value={ref[p.id] || ""} onChange={(e) => setRef({ ...ref, [p.id]: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Payment screenshot (optional)</Label><Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile({ ...file, [p.id]: e.target.files?.[0] || null })} /></div>
                  <Button onClick={() => submit(p)} disabled={busy === p.id}><Upload className="w-4 h-4 mr-2" />{busy === p.id ? "Submitting..." : "Submit payment details"}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
};

export default PortalPayments;
