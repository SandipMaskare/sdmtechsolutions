import { useState } from "react";
import { Send, Sparkles, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { callFunction } from "@/lib/functions";

export interface OriginalMail {
  from: string;
  subject: string;
  message: string;
}

interface Props {
  initialTo?: string;
  initialSubject?: string;
  original?: OriginalMail;
  onSent?: () => void;
}

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TONES = ["Professional and friendly", "Formal", "Short and direct", "Warm and encouraging", "Apologetic"];

const EmailComposer = ({ initialTo = "", initialSubject = "", original, onSent }: Props) => {
  const { toast } = useToast();
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState<"draft" | "improve" | "send" | null>(null);

  const ai = async (mode: "draft" | "improve") => {
    if (mode === "improve" && !body.trim()) {
      toast({ title: "Write something first", description: "Type your draft, then ask Gemini to improve it." });
      return;
    }
    if (mode === "draft" && !original && !instructions.trim()) {
      toast({ title: "Tell Gemini what to write", description: "Add a short instruction, e.g. 'invite the candidate for an interview on Monday'." });
      return;
    }
    setBusy(mode);
    const { data, error } = await callFunction<{ subject: string | null; body: string }>("ai-assist", {
      task: mode === "improve" ? "improve" : original ? "reply" : "compose",
      tone,
      instructions,
      from: original?.from ?? to,
      subject: original?.subject ?? subject,
      original: original?.message,
      draft: body,
    });
    setBusy(null);
    if (error || !data) {
      toast({ title: "Gemini could not help", description: error ?? "Try again", variant: "destructive" });
      return;
    }
    setBody(data.body);
    if (data.subject && (!subject || mode === "draft")) setSubject(data.subject);
  };

  const send = async () => {
    const list = to.split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean);
    if (list.length === 0 || !subject.trim() || !body.trim()) {
      toast({ title: "Fill in recipient, subject and message", variant: "destructive" });
      return;
    }
    setBusy("send");
    const { error } = await callFunction("send-email", {
      to: list,
      subject: subject.trim(),
      text: body,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${escHtml(body).replace(/\n/g, "<br>")}</div>`,
    });
    setBusy(null);
    if (error) {
      toast({ title: "Email not sent", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Email sent", description: `Delivered to ${list.length} recipient${list.length > 1 ? "s" : ""}.` });
    setBody("");
    if (!original) { setSubject(""); setTo(""); }
    onSent?.();
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="mail-to">To (separate several with commas)</Label>
          <Input id="mail-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.com" />
        </div>
        <div>
          <Label htmlFor="mail-subject">Subject</Label>
          <Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="w-4 h-4 text-primary" /> Gemini assistant
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_200px]">
          <Input
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={original ? "Optional: what should the reply say? e.g. 'thank them and ask for their resume'" : "What should the email say?"}
          />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Tone"
          >
            {TONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => ai("draft")} disabled={busy !== null}>
            {busy === "draft" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            {original ? "Draft reply with Gemini" : "Write with Gemini"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => ai("improve")} disabled={busy !== null}>
            {busy === "improve" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Wand2 className="w-4 h-4 mr-1" />}
            Improve my draft
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Always read the AI draft before sending. You can edit it freely.</p>
      </div>

      <div>
        <Label htmlFor="mail-body">Message</Label>
        <Textarea id="mail-body" rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <Button onClick={send} disabled={busy !== null}>
        {busy === "send" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Send email
      </Button>
    </div>
  );
};

export default EmailComposer;
