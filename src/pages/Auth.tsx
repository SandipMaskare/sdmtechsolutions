import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import sdmLogo from "@/assets/sdm-logo.jpg";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Check if user has a role to redirect to CRM
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (roleData?.role) {
            navigate("/crm/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (roleData?.role) {
          navigate("/crm/dashboard");
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please log in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to SDM Technology.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <a href="/" className="inline-block mb-6">
              <img src={sdmLogo} alt="SDM Technology" className="h-14 mx-auto" />
            </a>
            <h1 className="text-2xl font-bold text-foreground font-display">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Sign in to access your account"
                : "Join SDM Technology today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`pl-10 bg-background ${errors.email ? "border-destructive" : ""}`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`pl-10 pr-10 bg-background ${errors.password ? "border-destructive" : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold group"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin },
                });
                if (error) {
                  toast({
                    title: "Google Sign In Failed",
                    description: error.message,
                    variant: "destructive",
                  });
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, CalendarDays, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import sdmLogo from "@/assets/sdm-logo.jpg";

// Mobile OTP needs an SMS provider (Twilio etc.) enabled in Supabase.
// Set VITE_ENABLE_PHONE_OTP="true" in Vercel once that is done.
const PHONE_OTP = import.meta.env.VITE_ENABLE_PHONE_OTP === "true";

type Mode = "login" | "signup" | "verifyEmail" | "verifyPhone";

const emailSchema = z.string().trim().email("Please enter a valid email address");
const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character (e.g. @ # $ !)");

const normalizePhone = (raw: string): string | null => {
  const digits = raw.replace(/[^0-9]/g, "");
  const ten = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9][0-9]{9}$/.test(ten) ? `+91${ten}` : null;
};

const validDob = (v: string): string | null => {
  const d = new Date(v);
  if (!v || isNaN(d.getTime())) return "Enter your date of birth";
  const now = new Date();
  if (d > now) return "Date of birth cannot be in the future";
  const age = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  if (age < 16) return "You must be at least 16 years old";
  return null;
};

type Errors = Partial<Record<"name" | "email" | "phone" | "dob" | "password" | "confirm", string>>;

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  // While the user is in a verification step we must not auto-redirect them away.
  const inFlow = useRef(false);
  inFlow.current = mode === "verifyEmail" || mode === "verifyPhone";

  const isLogin = mode === "login";

  const goHome = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    navigate(roleData?.role ? "/crm/dashboard" : "/");
  };

  // After a session exists: require mobile verification (if enabled) before entering.
  const continueAfterSession = async (user: { id: string; phone?: string | null; phone_confirmed_at?: string | null; user_metadata?: any }) => {
    if (PHONE_OTP && !user.phone_confirmed_at) {
      const p = normalizePhone(user.user_metadata?.phone || phone || "");
      if (p) {
        setPhone(p);
        const { error } = await supabase.auth.updateUser({ phone: p });
        if (error) {
          toast({ title: "Could not send mobile OTP", description: error.message, variant: "destructive" });
          await goHome(user.id);
          return;
        }
        setOtp("");
        setCooldown(30);
        setMode("verifyPhone");
        toast({ title: "OTP sent", description: `Enter the code sent to ${p}` });
        return;
      }
    }
    await goHome(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !inFlow.current) {
        // defer: never call supabase inside the callback directly
        setTimeout(() => { continueAfterSession(session.user as any); }, 0);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !inFlow.current) continueAfterSession(session.user as any);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const clear = (k: keyof Errors) => errors[k] && setErrors({ ...errors, [k]: undefined });

  const validate = (): boolean => {
    const e: Errors = {};
    const em = emailSchema.safeParse(email);
    if (!em.success) e.email = em.error.errors[0].message;
    if (isLogin) {
      if (!password) e.password = "Enter your password";
    } else {
      if (name.trim().length < 2) e.name = "Enter your full name";
      if (!normalizePhone(phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
      const d = validDob(dob);
      if (d) e.dob = d;
      const pw = strongPassword.safeParse(password);
      if (!pw.success) e.password = pw.error.errors[0].message;
      if (confirm !== password) e.confirm = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            await supabase.auth.resend({ type: "signup", email: email.trim() });
            setOtp("");
            setMode("verifyEmail");
            toast({ title: "Verify your email", description: "We sent a new code to your email." });
          } else {
            toast({
              title: "Login Failed",
              description: error.message.includes("Invalid login credentials")
                ? "Invalid email or password. Please try again."
                : error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({ title: "Welcome back!", description: "You have successfully logged in." });
        }
      } else {
        const p = normalizePhone(phone)!;
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name.trim(), phone: p, dob },
          },
        });
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive",
          });
        } else if (data.session) {
          // email confirmation disabled in Supabase -> go straight to phone step
          await continueAfterSession(data.user as any);
        } else {
          setOtp("");
          setCooldown(30);
          setMode("verifyEmail");
          toast({ title: "Check your email", description: `We sent a verification code to ${email.trim()}` });
        }
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp, type: "signup" });
    if (error || !data.user) {
      toast({ title: "Invalid code", description: error?.message ?? "Please try again.", variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Email verified" });
    setOtp("");
    inFlow.current = false;
    await continueAfterSession(data.user as any);
    setLoading(false);
  };

  const verifyPhone = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "phone_change" });
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Mobile number verified", description: "Welcome to SDM Technology." });
    inFlow.current = false;
    const uid = data.user?.id ?? (await supabase.auth.getUser()).data.user?.id;
    if (uid) {
      await supabase.from("profiles").update({ phone }).eq("user_id", uid);
      await goHome(uid);
    }
    setLoading(false);
  };

  const resend = async () => {
    if (cooldown > 0) return;
    const { error } =
      mode === "verifyEmail"
        ? await supabase.auth.resend({ type: "signup", email: email.trim() })
        : await supabase.auth.updateUser({ phone });
    if (error) toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    else {
      setCooldown(30);
      toast({ title: "Code sent" });
    }
  };

  const social = async (provider: "google" | "linkedin_oidc") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const field = (
    label: string,
    key: keyof Errors,
    icon: React.ReactNode,
    input: React.ReactNode,
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
        {input}
      </div>
      {errors[key] && <p className="text-destructive text-sm mt-1">{errors[key]}</p>}
    </div>
  );

  const verifying = mode === "verifyEmail" || mode === "verifyPhone";

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <a href="/" className="inline-block mb-6">
              <img src={sdmLogo} alt="SDM Technology" className="h-14 mx-auto" />
            </a>
            <h1 className="text-2xl font-bold text-foreground font-display">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Account"}
              {mode === "verifyEmail" && "Verify your email"}
              {mode === "verifyPhone" && "Verify your mobile"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === "login" && "Sign in to access your account"}
              {mode === "signup" && "Join SDM Technology today"}
              {mode === "verifyEmail" && `Enter the 6-digit code sent to ${email}`}
              {mode === "verifyPhone" && `Enter the 6-digit code sent to ${phone}`}
            </p>
          </div>

          {verifying ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                className="w-full bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold"
                size="lg"
                disabled={loading || otp.length < 6}
                onClick={mode === "verifyEmail" ? verifyEmail : verifyPhone}
              >
                <ShieldCheck className="mr-2 w-5 h-5" />
                {loading ? "Verifying..." : "Verify"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't get it?{" "}
                <button onClick={resend} disabled={cooldown > 0} className="text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline">
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin &&
                field("Full Name", "name", <User />, (
                  <Input placeholder="John Doe" value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} className="pl-10 bg-background" />
                ))}

              {field("Email", "email", <Mail />, (
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} className={`pl-10 bg-background ${errors.email ? "border-destructive" : ""}`} />
              ))}

              {!isLogin && (
                <>
                  {field("Mobile Number", "phone", <Phone />, (
                    <Input type="tel" inputMode="numeric" placeholder="+91 98765 43210" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} className={`pl-10 bg-background ${errors.phone ? "border-destructive" : ""}`} />
                  ))}
                  {field("Date of Birth", "dob", <CalendarDays />, (
                    <Input type="date" max={new Date().toISOString().split("T")[0]} value={dob} onChange={(e) => { setDob(e.target.value); clear("dob"); }} className={`pl-10 bg-background ${errors.dob ? "border-destructive" : ""}`} />
                  ))}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clear("password"); }}
                    className={`pl-10 pr-10 bg-background ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                {!isLogin && !errors.password && (
                  <p className="text-xs text-muted-foreground mt-1">8+ characters with upper & lower case, a number and a special character.</p>
                )}
              </div>

              {!isLogin &&
                field("Confirm Password", "confirm", <Lock />, (
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirm} onChange={(e) => { setConfirm(e.target.value); clear("confirm"); }} className={`pl-10 bg-background ${errors.confirm ? "border-destructive" : ""}`} />
                ))}

              <Button type="submit" className="w-full bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold group" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-card text-muted-foreground">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => social("google")} disabled={loading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" onClick={() => social("linkedin_oidc")} disabled={loading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  LinkedIn
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            {verifying ? (
              <button onClick={() => { supabase.auth.signOut(); setMode("login"); setOtp(""); }} className="text-sm text-muted-foreground hover:underline">
                Back to sign in
              </button>
            ) : (
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => { setMode(isLogin ? "signup" : "login"); setErrors({}); }} className="text-primary hover:underline font-medium">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
