import { useCallback, useEffect, useState } from "react";
import { Plus, ExternalLink, Check, X, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase as typedClient } from "@/integrations/supabase/client";

// the generated types predate the payments table
const supabase: any = typedClient;
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { paymentMeta } from "@/pages/portal/PortalPayments";
import { notifyUser, PORTAL_URL } from "@/lib/notify";
import { fmtDate } from "@/lib/internProfile";

/** Admin-only: assign payments to interns, then verify / reject / waive them. */
const PaymentAdmin = ({ userId }: { userId?: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ user_id: userId || "", title: "Document verification fee", amount: "", instructions: "" });

  const load = useCallback(async () => {
    let q = supabase.from("payments").select("*").order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    const { data } = await q;
    setRows(data || []);
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "intern");
    const ids = (roles || []).map((r) => r.user_id);
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("user_id, full_name, email, intern_id").in("user_id", ids);
      setPeople(ps || []);
      const m: Record<string, string> = {};
      (ps || []).forEach((p: any) => (m[p.user_id] = p.full_name + (p.intern_id ? ` (${p.intern_id})` : "")));
      setNames(m);
    }
  }, [userId]);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    const amount = Number(form.amount);
    if (!form.user_id || !form.title.trim() || !(amount >= 0) || form.amount === "") {
      return toast({ title: "Choose an intern, a title and an amount", variant: "destructive" });
    }
    const { error } = await supabase.from("payments").insert({
      user_id: form.user_id, title: form.title.trim(), amount, instructions: form.instructions.trim() || null, created_by: user?.id,
    });
    if (error) return toast({ title: "Could not create", description: error.message, variant: "destructive" });
    const who = people.find((x) => x.user_id === form.user_id);
    if (who?.email) {
      await notifyUser({
        email: who.email, name: who.full_name, subject: `Payment due: ${form.title.trim()}`,
        lines: [`A payment has been assigned to you: ${form.title.trim()} — ₹${amount.toLocaleString("en-IN")}.`, form.instructions.trim() || "Open the Payments tab for details.", "After paying, enter your transaction (UTR) number on the portal. You will get a receipt once it is verified."],
        link: { label: "Open Payments", url: `${PORTAL_URL}/payments` },
      });
    }
    toast({ title: "Payment assigned", description: who?.email ? "Intern notified by email." : undefined });
    setOpen(false);
    setForm({ ...form, amount: "", instructions: "" });
    load();
  };

  const setStatus = async (p: any, status: string, note?: string) => {
    const patch: any = { status, admin_note: note ?? p.admin_note };
    if (status === "verified") { patch.verified_at = new Date().toISOString(); patch.verified_by = user?.id; }
    const { error } = await supabase.from("payments").update(patch).eq("id", p.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    const who = people.find((x) => x.user_id === p.user_id);
    if (who?.email && (status === "verified" || status === "rejected")) {
      await notifyUser({
        email: who.email, name: who.full_name,
        subject: status === "verified" ? `Payment verified: ${p.title}` : `Payment needs attention: ${p.title}`,
        lines: status === "verified"
          ? [`Your payment of ₹${Number(p.amount).toLocaleString("en-IN")} for "${p.title}" is verified. Your receipt is ready to download.`]
          : [`Your payment details for "${p.title}" could not be verified.`, note ? `Reason: ${note}` : "Please check the details and submit again."],
        link: { label: status === "verified" ? "Download receipt" : "Open Payments", url: `${PORTAL_URL}/payments` },
      });
    }
    load();
  };

  const reject = (p: any) => {
    const note = window.prompt("Reason for rejecting (shown to the intern):", p.admin_note || "");
    if (note !== null) setStatus(p, "rejected", note);
  };

  const remove = async (p: any) => {
    if (!window.confirm("Delete this payment record?")) return;
    await supabase.from("payments").delete().eq("id", p.id);
    load();
  };

  const proof = async (path: string) => {
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 300);
    if (error || !data) return toast({ title: "Could not open proof", description: error?.message, variant: "destructive" });
    window.open(data.signedUrl, "_blank");
  };

  const shown = rows.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(paymentMeta).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Assign payment</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {!userId && <TableHead>Intern</TableHead>}
            <TableHead>Payment</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Reference</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((p) => (
            <TableRow key={p.id}>
              {!userId && <TableCell className="font-medium">{names[p.user_id] || p.user_id.slice(0, 8)}</TableCell>}
              <TableCell>{p.title}<div className="text-xs text-muted-foreground">{fmtDate(p.created_at)}</div></TableCell>
              <TableCell>₹{Number(p.amount).toLocaleString("en-IN")}</TableCell>
              <TableCell><Badge className={paymentMeta[p.status]?.className}>{paymentMeta[p.status]?.label}</Badge></TableCell>
              <TableCell className="text-sm">
                {p.reference || "—"}
                {p.proof_url && <button className="ml-2 inline-flex items-center text-primary underline" onClick={() => proof(p.proof_url)}><ExternalLink className="w-3 h-3 mr-1" />proof</button>}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {p.status === "submitted" && <>
                  <Button size="sm" variant="outline" className="mr-1" onClick={() => setStatus(p, "verified")}><Check className="w-4 h-4 mr-1" />Verify</Button>
                  <Button size="sm" variant="outline" className="mr-1" onClick={() => reject(p)}><X className="w-4 h-4 mr-1" />Reject</Button>
                </>}
                {["requested", "rejected"].includes(p.status) && <Button size="sm" variant="ghost" className="mr-1" title="Waive" onClick={() => setStatus(p, "waived")}><Ban className="w-4 h-4" /></Button>}
                <Button size="sm" variant="ghost" onClick={() => remove(p)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {shown.length === 0 && <p className="text-center text-muted-foreground py-6 text-sm">No payments yet.</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign a payment to an intern</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {!userId && (
              <div className="space-y-1.5"><Label>Intern</Label>
                <Select value={form.user_id} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select intern" /></SelectTrigger>
                  <SelectContent>{people.map((p) => <SelectItem key={p.user_id} value={p.user_id}>{p.full_name}{p.intern_id ? ` (${p.intern_id})` : ""}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Payment instructions (UPI ID, bank details, deadline)</Label><Textarea rows={4} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></div>
            <Button className="w-full" onClick={create}>Assign payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentAdmin;
