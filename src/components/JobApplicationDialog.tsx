import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

const JobApplicationDialog = ({ open, onOpenChange, jobId, jobTitle }: JobApplicationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in to apply", variant: "destructive" });
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    let resumeUrl: string | null = null;

    // Upload resume if provided
    if (resumeFile) {
      const fileExt = resumeFile.name.split(".").pop();
      const filePath = `${user.id}/${jobId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile);

      if (uploadError) {
        toast({ title: "Resume upload failed", description: uploadError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      resumeUrl = filePath;
    }

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      job_id: jobId,
      full_name: fullName,
      email,
      phone: phone || null,
      resume_url: resumeUrl,
      cover_letter: coverLetter || null,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Application failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!", description: "We'll review your application and get back to you soon." });
      onOpenChange(false);
      // Reset form
      setFullName("");
      setPhone("");
      setCoverLetter("");
      setResumeFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="space-y-2">
            <Label>Resume (PDF)</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." rows={4} />
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
