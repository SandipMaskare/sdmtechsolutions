import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase as typedClient } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const supabase: any = typedClient; // generated types predate this table
const blank = { label: "", details: "", qr_url: "", is_active: true };

/** Admin: add the ways interns can pay (UPI, bank transfer, QR code, etc.). */
const PaymentMethodsAdmin = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [f, setF] = useState<any>(blank);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("payment_methods").select("*").order("display_order").order("created_at");
    setRows(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEdit(null); setF(blank); setOpen(true); };
  const openEdit = (r: any) => { setEdit(r); setF({ label: r.label, details: r.details, qr_url: r.qr_url || "", is_active: r.is_active }); setOpen(true); };

  const upload = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    const path = `qr-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("payment-qr").upload(path, file);
    setBusy(false);
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    setF((x: any) => ({ ...x, qr_url: supabase.storage.from("payment-qr").getPublicUrl(path).data.publicUrl }));
  };

  const save = async () => {
    if (!f.label.trim() || !f.details.trim()) return toast({ title: "Enter a name and the payment details", variant: "destructive" });
    const row = { label: f.label.trim(), details: f.details.trim(), qr_url: f.qr_url || null, is_active: f.is_active };
    const { error } = edit ? await supabase.from("payment_methods").update(row).eq("id", edit.id) : await supabase.from("payment_methods").insert(row);
    if (error) return toast({ title: "Could not save", description: error.message, variant: "destructive" });
    setOpen(false);
    load();
  };

  const toggle = async (r: any) => { await supabase.from("payment_methods").update({ is_active: !r.is_active }).eq("id", r.id); load(); };
  const remove = async (r: any) => {
    if (!window.confirm(`Delete "${r.label}"?`)) return;
    await supabase.from("payment_methods").delete().eq("id", r.id);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Active methods are shown to interns on their Payments page.</p>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" />Add method</Button>
      </div>
      {rows.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No payment methods yet. Add UPI, bank transfer or a QR code.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">{r.label}</div>
              <Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Shown" : "Hidden"}</Badge>
            </div>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{r.details}</p>
            {r.qr_url && <img src={r.qr_url} alt="QR" className="h-28 w-28 object-contain rounded border" />}
            <div className="flex items-center gap-1 pt-1">
              <Switch checked={r.is_active} onCheckedChange={() => toggle(r)} />
              <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(r)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{edit ? "Edit payment method" : "Add payment method"}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5"><Label>Name</Label><Input value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder="UPI, Bank transfer, PhonePe, PayPal..." /></div>
            <div className="space-y-1.5"><Label>Details (UPI ID, account number + IFSC, instructions)</Label><Textarea rows={4} value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="flex items-center gap-1"><QrCode className="w-4 h-4" />QR code image (optional)</Label>
              <Input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0] || null)} disabled={busy} />
              {f.qr_url && <img src={f.qr_url} alt="QR" className="h-24 w-24 object-contain rounded border" />}
            </div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: v })} />Show to interns</label>
            <Button className="w-full" onClick={save} disabled={busy}>Save method</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PaymentMethodsAdmin;
