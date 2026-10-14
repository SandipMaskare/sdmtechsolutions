import PageNav from "@/components/PageNav";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { homePath, pickRole } from "@/lib/roles";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { requestLoginCode, sendLoginCode, verifyLoginCode } from "@/lib/loginOtp";
import sdmLogo from "@/assets/sdm-logo.webp";

type Kind = "employee" | "intern";

const copy = {
  employee: {
    title: "Employee Login",
    sub: "Sign in to see your tasks and submit your work.",
    icon: Briefcase,
    other: { to: "/intern/login", label: "Intern login" },
  },
  intern: {
    title: "Intern Login",
    sub: "Sign in to see your projects and submit your work.",
    icon: GraduationCap,
    other: { to: "/employee/login", label: "Employee login" },
  },
} as const;

const PortalLogin = ({ kind }: { kind: Kind }) => {
  const c = copy[kind];
  const Icon = c.icon;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"password" | "code">("password");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({ title: "Enter your email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await requestLoginCode(email.trim(), password);
    if (!res.ok) {
      toast({ title: "Login failed", description: res.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setCode("");
    setCooldown(60);
    setStep("code");
    toast({ title: "Check your email", description: `We sent a 6-digit login code to ${email.trim()}` });
    setLoading(false);
  };

  const resend = async () => {
    if (cooldown > 0) return;
    const r = await sendLoginCode(email.trim());
    if (!r.ok) return toast({ title: "Could not resend", description: r.message, variant: "destructive" });
    setCooldown(60);
    toast({ title: "Code sent" });
  };

  const verify = async () => {
    if (code.length < 6) return;
    setLoading(true);
    const { data, error } = await verifyLoginCode(email.trim(), code);
    if (error || !data.user) {
      toast({ title: "Invalid or expired code", description: error?.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const role = pickRole(roles);

    if (role === kind) {
      navigate(homePath(role), { replace: true });
      return;
    }
    if (role === "admin") {
      navigate(homePath(role), { replace: true });
      return;
    }

    await supabase.auth.signOut();
    setStep("password");
    setCode("");
    toast({
      title: `This account is not an ${kind} account`,
      description:
        role === null
          ? `Ask the admin to give your account ${kind} access, then try again.`
          : `Please use the ${role === "employee" ? "employee" : "intern"} login instead.`,
      variant: "destructive",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <PageNav floating />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-5">
              <img src={sdmLogo} alt="SDM Technology" className="h-14 mx-auto" width={56} height={56} />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-accent mx-auto flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-display">{c.title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{c.sub}</p>
          </div>

          {step === "code" ? (
            <div className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">Enter the 6-digit code we emailed to <b>{email}</b>.</p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button size="lg" className="w-full" disabled={loading || code.length < 6} onClick={verify}>
                <ShieldCheck className="w-5 h-5 mr-2" />
                {loading ? "Verifying..." : "Verify and sign in"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't get it?{" "}
                <button type="button" onClick={resend} disabled={cooldown > 0} className="text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline">
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
              <p className="text-center">
                <button type="button" onClick={() => { setStep("password"); setCode(""); }} className="text-sm text-muted-foreground hover:underline">Back</button>
              </p>
            </div>
          ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-background" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type={show ? "text" : "password"} autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-background" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <ShieldCheck className="w-5 h-5 mr-2" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            <p>
              No account yet? <Link to="/auth" className="text-primary hover:underline">Create one</Link>, then ask the admin to give it {kind} access.
            </p>
            <p>
              <Link to={c.other.to} className="text-primary hover:underline">{c.other.label}</Link>
              {" · "}
              <Link to="/auth" className="text-primary hover:underline">User login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalLogin;
