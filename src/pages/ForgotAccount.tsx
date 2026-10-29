import AuthBackdrop from "@/components/AuthBackdrop";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Eye, EyeOff, KeyRound, Lock, Mail, Phone, UserSearch } from "lucide-react";
import PageNav from "@/components/PageNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { callFunction } from "@/lib/functions";
import { useToast } from "@/hooks/use-toast";
import { isAppMode } from "@/lib/appMode";
import sdmLogo from "@/assets/sdm-logo.webp";

// The reset link must open the real website (the Android app runs on a local address), and this address
// must be listed in Supabase -> Authentication -> URL Configuration -> Redirect URLs.
export const RESET_URL = "https://www.sdmtechsolution.com/reset-password";

type Tab = "password" | "username";

const strongPassword = z.string().min(8, "At least 8 characters").regex(/[a-z]/, "Add a lowercase letter").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number").regex(/[^A-Za-z0-9]/, "Add a special character (e.g. @ # $ !)");

const ForgotAccount = () => {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(params.get("tab") === "username" ? "username" : "password");
  const { toast } = useToast();
  const appMode = isAppMode();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [, tick] = useState(0);

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState<{ email_masked: string; intern_id: string | null; employee_id: string | null } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
  useEffect(() => {
    if (!sent) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [sent]);

  // Step 1: email a 6-digit code (no link). The code is checked on this page together with the new password.
  const sendReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    if (Date.now() < cooldownUntil) return;
    setSending(true);
    const { error } = await callFunction("password-reset", { action: "send", email: em });
    setSending(false);
    if (error) {
      toast({ title: "Could not send the code", description: error, variant: "destructive" });
      return;
    }
    setCooldownUntil(Date.now() + 60_000);
    setCode("");
    setSent(true);
  };

  // Step 2: the code from the email plus the new password.
  const useCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
    const strong = strongPassword.safeParse(pw1);
    if (!strong.success) return toast({ title: strong.error.errors[0].message, variant: "destructive" });
    if (pw1 !== pw2) return toast({ title: "Passwords do not match", variant: "destructive" });
    setChecking(true);
    const { error } = await callFunction("password-reset", { action: "confirm", email: email.trim(), code, password: pw1 });
    setChecking(false);
    if (error) {
      toast({ title: "Password not changed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "Please sign in with your new password." });
    navigate("/auth");
  };

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setFound(null);
    setLooking(true);
    const { data, error } = await callFunction<{ email_masked: string; intern_id: string | null; employee_id: string | null }>("recover-account", { phone, dob });
    setLooking(false);
    if (error || !data) setLookupError(error ?? "Something went wrong. Please try again.");
    else setFound(data);
  };

  const tabBtn = (t: Tab, label: string, Icon: typeof KeyRound) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-hero flex items-center justify-center p-4" style={appMode ? { paddingTop: "calc(env(safe-area-inset-top) + 1rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" } : undefined}>
      <AuthBackdrop />
      {!appMode && <PageNav floating />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="sdm-auth-card relative bg-card/95 backdrop-blur border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <img src={sdmLogo} alt="SDM Technology" className="h-14 mx-auto mb-4" width={56} height={56} />
            <h1 className="text-2xl font-bold text-foreground font-display">Account help</h1>
            <p className="text-muted-foreground mt-2 text-sm">Reset your password or find the email you signed up with.</p>
          </div>

          <div className="flex gap-2 mb-6">
            {tabBtn("password", "Forgot password", KeyRound)}
            {tabBtn("username", "Forgot username", UserSearch)}
          </div>

          {tab === "password" ? (
            sent ? (
              <form onSubmit={useCode} className="space-y-4 text-sm">
                <div className="rounded-lg bg-accent p-4 text-foreground">
                  <p className="font-medium">Enter the code we emailed you</p>
                  <p className="mt-1 text-muted-foreground">If an account exists for <b>{email.trim()}</b>, a 6-digit code is on its way. It can take a minute. Check spam too. The code works for 10 minutes.</p>
                </div>
                <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="bg-background tracking-widest text-center text-lg" />
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="New password" value={pw1} onChange={(e) => setPw1(e.target.value)} className="pl-10 pr-10 bg-background" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Show or hide password">{showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Confirm new password" value={pw2} onChange={(e) => setPw2(e.target.value)} className="pl-10 bg-background" />
                </div>
                <p className="text-xs text-muted-foreground">8+ characters with upper and lower case, a number and a special character.</p>
                <Button type="submit" className="w-full" size="lg" disabled={checking || code.length < 6 || !pw1}>{checking ? "Saving..." : "Save new password"}</Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" disabled={sending || secondsLeft > 0} onClick={() => sendReset()}>{secondsLeft > 0 ? `Send again in ${secondsLeft}s` : sending ? "Sending..." : "Send a new code"}</Button>
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => { setSent(false); setCode(""); }}>Change email</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={sendReset} className="space-y-4">
                <p className="text-sm text-muted-foreground">Enter the email you signed up with. We will email you a 6-digit code to set a new password.</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-background" />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={sending}>{sending ? "Sending..." : "Send code"}</Button>
              </form>
            )
          ) : (
            <form onSubmit={lookup} className="space-y-4">
              <p className="text-sm text-muted-foreground">Forgot which email or ID you used? Enter the mobile number and date of birth saved on your account. For your safety we only show part of your email.</p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="tel" inputMode="numeric" placeholder="Registered mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 bg-background" />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="date" max={new Date().toISOString().split("T")[0]} value={dob} onChange={(e) => setDob(e.target.value)} className="pl-10 bg-background" />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={looking || phone.replace(/\D/g, "").length < 10 || !dob}>{looking ? "Checking..." : "Find my account"}</Button>
              {lookupError && <p className="text-sm text-destructive">{lookupError}</p>}
              {found && (
                <div className="rounded-lg bg-accent p-4 text-sm space-y-1">
                  <p className="font-medium text-foreground">We found your account</p>
                  <p className="text-muted-foreground">Sign in with: <b className="text-foreground">{found.email_masked}</b></p>
                  {found.intern_id && <p className="text-muted-foreground">Intern ID: <b className="text-foreground">{found.intern_id}</b></p>}
                  {found.employee_id && <p className="text-muted-foreground">Employee ID: <b className="text-foreground">{found.employee_id}</b></p>}
                  <p className="pt-1 text-muted-foreground">Forgot the password too? Use the <button type="button" className="text-primary underline" onClick={() => setTab("password")}>Forgot password</button> tab.</p>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-sm space-y-2">
            <Link to="/auth" className="inline-flex items-center gap-1 text-primary hover:underline"><ArrowLeft className="w-4 h-4" /> Back to sign in</Link>
            <p className="text-muted-foreground">Still stuck? Write to <a className="text-primary hover:underline" href="mailto:sdmtechnologies.pvtltd@gmail.com">sdmtechnologies.pvtltd@gmail.com</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotAccount;
