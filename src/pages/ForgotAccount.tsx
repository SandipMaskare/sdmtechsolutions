import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, KeyRound, Mail, Phone, UserSearch } from "lucide-react";
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
  const [checking, setChecking] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState<{ email_masked: string; intern_id: string | null; employee_id: string | null } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    if (Date.now() < cooldownUntil) {
      toast({ title: "Please wait a minute before asking for another link" });
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(em, { redirectTo: RESET_URL });
    setSending(false);
    if (error) {
      const m = error.message.toLowerCase();
      toast({
        title: "Could not send the link",
        description: m.includes("security purposes") || m.includes("rate limit") ? "Too many requests. Please wait a minute and try again." : error.message,
        variant: "destructive",
      });
      return;
    }
    setCooldownUntil(Date.now() + 60_000);
    setSent(true);
  };

  // Alternative to the email link (links can be used up by mail scanners): the 6-digit code from the same email.
  const useCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.replace(/\D/g, "").slice(0, 6);
    if (token.length < 6) return;
    setChecking(true);
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token, type: "recovery" });
    setChecking(false);
    if (error || !data.session) {
      toast({ title: "Code not accepted", description: "The code is wrong or expired. Use the newest email, or go back and request a new one.", variant: "destructive" });
      setCode("");
      return;
    }
    navigate("/reset-password?type=recovery");
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" style={appMode ? { paddingTop: "calc(env(safe-area-inset-top) + 1rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" } : undefined}>
      {!appMode && <PageNav floating />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
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
              <div className="space-y-4 text-sm">
                <div className="rounded-lg bg-accent p-4 text-foreground">
                  <p className="font-medium">Check your email</p>
                  <p className="mt-1 text-muted-foreground">If an account exists for <b>{email.trim()}</b>, we sent a link to choose a new password. It can take a minute. Check spam too. The link works for a short time and only once.</p>
                </div>
                <form onSubmit={useCode} className="space-y-2 rounded-lg border p-4">
                  <p className="text-muted-foreground">Link says expired? If your email also has a 6-digit code, enter it here instead.</p>
                  <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="bg-background tracking-widest text-center" />
                  <Button type="submit" className="w-full" disabled={checking || code.length < 6}>{checking ? "Checking..." : "Continue with code"}</Button>
                </form>
                <Button variant="outline" className="w-full" onClick={() => { setSent(false); setCode(""); }}>Use a different email or send again</Button>
              </div>
            ) : (
              <form onSubmit={sendReset} className="space-y-4">
                <p className="text-sm text-muted-foreground">Enter the email you signed up with. We will email you a link to set a new password.</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-background" />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={sending}>{sending ? "Sending..." : "Send reset link"}</Button>
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
