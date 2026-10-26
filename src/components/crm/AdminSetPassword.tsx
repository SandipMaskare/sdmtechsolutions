import { useState } from "react";
import { Copy, Eye, EyeOff, KeyRound, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { callFunction } from "@/lib/functions";

const strong = (p: string) => p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);

const generate = () => {
  const pick = (chars: string) => chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length];
  const all = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$!";
  const chars = [pick("abcdefghijkmnpqrstuvwxyz"), pick("ABCDEFGHJKLMNPQRSTUVWXYZ"), pick("23456789"), pick("@#$!")];
  while (chars.length < 12) chars.push(pick(all));
  return chars.sort(() => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 - 0.5).join("");
};

/** Admin sets a new password for an intern or employee (shown once so it can be passed on). */
const AdminSetPassword = ({ userId, name, email }: { userId: string; name: string; email?: string | null }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const close = (v: boolean) => { setOpen(v); if (!v) { setPw(""); setDone(null); } };
  const save = async () => {
    if (!strong(pw)) return toast({ title: "Use 8+ characters with upper and lower case, a number and a special character", variant: "destructive" });
    if (!confirm(`Change ${name}'s password now? Their old password will stop working.`)) return;
    setBusy(true);
    const { error } = await callFunction("password-reset", { action: "admin-set", user_id: userId, password: pw });
    setBusy(false);
    if (error) return toast({ title: "Could not change the password", description: error, variant: "destructive" });
    setDone(pw);
    toast({ title: "Password changed" });
  };
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); toast({ title: "Copied" }); } catch { /* ignore */ } };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}><KeyRound className="w-4 h-4 mr-2" />Change password</Button>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Change password for {name}</DialogTitle></DialogHeader>
          {done ? (
            <div className="space-y-3 text-sm">
              <p className="text-green-700">The password was changed. Share it with {name} safely; it is not shown again.</p>
              <div className="rounded-md border bg-muted p-3 font-mono break-all">{email ? `${email}\n` : ""}{done}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(`${email ? `Email: ${email}\n` : ""}New password: ${done}`)}><Copy className="w-4 h-4 mr-1" />Copy login details</Button>
                <Button size="sm" onClick={() => close(false)}>Done</Button>
              </div>
              <p className="text-xs text-muted-foreground">Ask them to change it again from My Profile after signing in.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label>New password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className="pr-9" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-2.5 text-muted-foreground" aria-label="Show or hide">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setPw(generate())}><Wand2 className="w-4 h-4 mr-1" />Generate</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">8+ characters with upper and lower case, a number and a special character.</p>
              </div>
              <Button className="w-full" disabled={busy || !pw} onClick={save}>{busy ? "Saving..." : "Change password"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AdminSetPassword;
