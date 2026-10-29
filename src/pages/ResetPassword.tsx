import AuthBackdrop from "@/components/AuthBackdrop";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { z } from "zod";
import PageNav from "@/components/PageNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import sdmLogo from "@/assets/sdm-logo.webp";

const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character (e.g. @ # $ !)");

/** Page the reset-password email links to. Supabase signs the visitor in with a short recovery session. */
const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [waited, setWaited] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const linkProblem = /error_code=|error=access_denied/i.test(hash) ? "This link has expired or was already used." : null;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Link opened in a tab where the recovery session was already created.
    if (/type=recovery|[?&]code=/i.test(window.location.href)) {
      supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    }
    const t = setTimeout(() => setWaited(true), 5000);
    return () => { subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const pw = strongPassword.safeParse(password);
    if (!pw.success) return setError(pw.error.errors[0].message);
    if (password !== confirm) return setError("Passwords do not match");
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setSaving(false);
      const m = err.message.toLowerCase();
      return setError(m.includes("same") ? "Choose a password you have not used before." : err.message);
    }
    await supabase.auth.signOut();
    toast({ title: "Password updated", description: "Please sign in with your new password." });
    navigate("/auth");
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <AuthBackdrop />
      <PageNav floating />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="sdm-auth-card relative bg-card/95 backdrop-blur border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <img src={sdmLogo} alt="SDM Technology" className="h-14 mx-auto mb-4" width={56} height={56} />
            <h1 className="text-2xl font-bold text-foreground font-display">Choose a new password</h1>
          </div>

          {ready ? (
            <form onSubmit={save} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type={show ? "text" : "password"} autoComplete="new-password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-background" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Show or hide password">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type={show ? "text" : "password"} autoComplete="new-password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10 bg-background" />
              </div>
              <p className="text-xs text-muted-foreground">8+ characters with upper and lower case, a number and a special character.</p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={saving}>
                <ShieldCheck className="w-5 h-5 mr-2" />{saving ? "Saving..." : "Save new password"}
              </Button>
            </form>
          ) : linkProblem || waited ? (
            <div className="space-y-4 text-sm text-center">
              <p className="text-foreground">{linkProblem ?? "This reset link is not valid anymore."}</p>
              <p className="text-muted-foreground">Reset links work once and for a short time. Some email apps open the link in the background, which uses it up. Request a new one and open it straight away.</p>
              <Button asChild className="w-full"><Link to="/forgot">Get a new link</Link></Button>
            </div>
          ) : (
            <div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
