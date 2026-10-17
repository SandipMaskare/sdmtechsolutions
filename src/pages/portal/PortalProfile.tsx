import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout, { PortalKind, portalCopy } from "@/components/portal/PortalLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DOMAIN_OPTIONS, MODES, missingFields, durationText, COMPANY_LINKEDIN } from "@/lib/internProfile";
import { Checkbox } from "@/components/ui/checkbox";

const empty = {
  full_name: "", phone: "", college: "", city: "", intern_id: "", internship_domain: "", internship_mode: "Virtual (Online)",
  internship_start: "", internship_end: "", offer_role: "", offer_date: "", linkedin_url: "", github_url: "", skills: "", bio: "",
  department: "", position: "", employee_id: "", follows_company: false, joined_community: false,
};

const PortalProfile = ({ kind }: { kind: PortalKind }) => {
  const c = portalCopy[kind];
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState<any>(empty);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ a: "", b: "" });
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        const next: any = { ...empty };
        Object.keys(empty).forEach((k) => (next[k] = (data as any)[k] ?? (empty as any)[k]));
        setF(next);
        setAvatar((data as any).avatar_url || null);
      }
      setLoaded(true);
    });
  }, [user]);

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const missing = missingFields(f, kind);
  const isIntern = kind === "intern";

  const save = async () => {
    if (!user) return;
    if (missing.length) {
      toast({ title: "Please complete the required fields", description: missing.map((m) => m.label).join(", "), variant: "destructive" });
      return;
    }
    if (isIntern && f.internship_end < f.internship_start) {
      toast({ title: "End date must be after the start date", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: any = {};
    Object.keys(empty).forEach((k) => {
      if (typeof (empty as any)[k] === "boolean") { payload[k] = !!f[k]; return; }
      const v = (f[k] ?? "").toString().trim();
      payload[k] = v === "" ? null : v;
    });
    payload.full_name = f.full_name.trim();
    const { error } = await supabase.from("profiles").update(payload).eq("user_id", user.id);
    setSaving(false);
    if (error) {
      const dup = error.message.includes("profiles_intern_id_uq");
      toast({ title: dup ? "This Intern ID is already used" : "Could not save", description: dup ? "Check the ID on your offer letter, or contact the admin." : error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile saved" });
    navigate(c.base);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/avatar.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl + `?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    setAvatar(url);
  };

  const changePw = async () => {
    if (pw.a.length < 6) return toast({ title: "Password must be at least 6 characters", variant: "destructive" });
    if (pw.a !== pw.b) return toast({ title: "Passwords do not match", variant: "destructive" });
    const { error } = await supabase.auth.updateUser({ password: pw.a });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Password changed" });
    setPw({ a: "", b: "" });
    setPwOpen(false);
  };

  const field = (k: string, label: string, props: any = {}, req = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}{req && <span className="text-destructive"> *</span>}</Label>
      <Input id={k} value={f[k]} onChange={(e) => set(k, e.target.value)} {...props} />
    </div>
  );

  if (!loaded) return <PortalLayout kind={kind}><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></PortalLayout>;

  return (
    <PortalLayout kind={kind}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            {isIntern
              ? "Fill in the internship details exactly as written in your offer letter. The admin uses this to assign work for your domain."
              : "Keep your details up to date."}
          </p>
        </div>

        {missing.length > 0 ? (
          <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6 flex gap-3 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Complete your profile to continue</p>
                <p className="text-sm">Still needed: {missing.map((m) => m.label).join(", ")}.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500/50">
            <CardContent className="pt-6 flex gap-3 items-center text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" /> <span className="text-sm">Profile complete.{isIntern && ` Internship: ${durationText(f)}`}</span>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Personal details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-muted border overflow-hidden flex items-center justify-center">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-muted-foreground">{f.full_name?.[0]?.toUpperCase() || "U"}</span>}
                <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer text-white">
                  <Camera className="w-5 h-5" /><input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                </label>
              </div>
              <div className="text-sm text-muted-foreground">{user?.email}<br />Role: <span className="capitalize">{role}</span></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("full_name", "Full name", {}, true)}
              {field("phone", "Phone number", { inputMode: "tel" }, true)}
              {isIntern && field("college", "College / University", {}, true)}
              {field("city", "City")}
              {!isIntern && field("employee_id", "Employee ID", { placeholder: "Your SDM employee ID" }, true)}
              {!isIntern && field("department", "Department")}
              {!isIntern && field("position", "Position", {}, true)}
            </div>
          </CardContent>
        </Card>

        {isIntern && (
          <Card>
            <CardHeader><CardTitle>Internship details (from your offer letter)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {field("intern_id", "Intern ID", { placeholder: "e.g. SDM/C/001" }, true)}
                <div className="space-y-1.5">
                  <Label>Internship domain <span className="text-destructive">*</span></Label>
                  <Select value={f.internship_domain} onValueChange={(v) => set("internship_domain", v)}>
                    <SelectTrigger><SelectValue placeholder="Select your domain" /></SelectTrigger>
                    <SelectContent>{DOMAIN_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {field("offer_role", "Role named in offer letter", { placeholder: "e.g. Python Developer Intern" })}
                <div className="space-y-1.5">
                  <Label>Mode of internship</Label>
                  <Select value={f.internship_mode} onValueChange={(v) => set("internship_mode", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{MODES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {field("internship_start", "Start date", { type: "date" }, true)}
                {field("internship_end", "End date", { type: "date" }, true)}
                {field("offer_date", "Offer letter date", { type: "date" })}
              </div>
              {f.internship_start && f.internship_end && <p className="text-sm text-muted-foreground">Duration: {durationText(f)}</p>}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>About you</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {field("linkedin_url", "LinkedIn profile link", { placeholder: "https://linkedin.com/in/..." }, true)}
              {field("github_url", "GitHub / Portfolio URL", { placeholder: "https://github.com/..." })}
            </div>
            <div className="space-y-1.5"><Label>Skills</Label><Input value={f.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Python, React, Figma..." /></div>
            <div className="space-y-1.5"><Label>Short bio</Label><Textarea rows={3} value={f.bio} onChange={(e) => set("bio", e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stay connected with SDM Technology</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">Following our company page is mandatory. When you post your projects on LinkedIn, tag <b>SDM Technology</b>.</p>
            <Button type="button" variant="outline" asChild><a href={COMPANY_LINKEDIN} target="_blank" rel="noopener noreferrer">Open SDM Technology on LinkedIn</a></Button>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={!!f.follows_company} onCheckedChange={(v) => set("follows_company", !!v)} className="mt-0.5" />
              <span>I follow the SDM Technology LinkedIn company page <span className="text-destructive">*</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={!!f.joined_community} onCheckedChange={(v) => set("joined_community", !!v)} className="mt-0.5" />
              <span>I have joined the SDM Technology community for career opportunities</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={save} disabled={saving} className="flex-1">{saving ? "Saving..." : "Save profile"}</Button>
          <Dialog open={pwOpen} onOpenChange={setPwOpen}>
            <DialogTrigger asChild><Button variant="outline"><Lock className="w-4 h-4 mr-2" />Change password</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Change password</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input type="password" placeholder="New password" value={pw.a} onChange={(e) => setPw({ ...pw, a: e.target.value })} />
                <Input type="password" placeholder="Confirm password" value={pw.b} onChange={(e) => setPw({ ...pw, b: e.target.value })} />
                <Button className="w-full" onClick={changePw}>Update password</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PortalProfile;
