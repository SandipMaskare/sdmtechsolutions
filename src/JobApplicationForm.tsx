import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_MB = 5;
const ALLOWED = ["pdf", "doc", "docx"];

const JobApplicationForm = ({ jobId, onDone }: { jobId: string; onDone?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground mb-4">Please sign in to apply for this job.</p>
        <Button onClick={() => navigate("/auth")}>Sign in / Sign up</Button>
      </div>
    );
  }

  const fail = (title: string, description?: string) =>
    toast({ title, description, variant: "destructive" });

  const handleFile = (f: File | null) => {
    if (!f) return setResumeFile(null);
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED.includes(ext)) {
      fail("Unsupported file", "Please upload a PDF, DOC or DOCX file.");
      return setResumeFile(null);
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      fail("File too large", `Resume must be under ${MAX_MB} MB.`);
      return setResumeFile(null);
    }
    setResumeFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!UUID.test(jobId)) return fail("This job is no longer available", "Please go back and choose a current opening.");
    if (!fullName.trim() || !email.trim()) return fail("Please fill in your name and email");
    if (!resumeFile) return fail("Please attach your resume");

    setSubmitting(true);
    try {
      const ext = resumeFile.name.split(".").pop()!.toLowerCase();
      const filePath = `${user.id}/${jobId}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, { contentType: resumeFile.type || undefined, upsert: false });
      if (uploadError) return fail("Resume upload failed", uploadError.message);

      const { error } = await supabase.from("job_applications").insert({
        user_id: user.id,
        job_id: jobId,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        resume_url: filePath,
        cover_letter: coverLetter.trim() || null,
      });
      if (error) {
        await supabase.storage.from("resumes").remove([filePath]);
        return fail("Application failed", error.message);
      }
      toast({ title: "Application submitted!", description: "We'll review it and get back to you soon." });
      onDone?.();
    } catch (err: any) {
      fail("Something went wrong", err?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-2">
        <Label>Full Name *</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
      </div>
      <div className="space-y-2">
        <Label>Email *</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
      </div>
      <div className="space-y-2">
        <Label>Resume * (PDF, DOC or DOCX, max {MAX_MB} MB)</Label>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
        {resumeFile && <p className="text-xs text-muted-foreground">Selected: {resumeFile.name}</p>}
      </div>
      <div className="space-y-2">
        <Label>Cover Letter</Label>
        <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." rows={4} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};

export default JobApplicationForm;
