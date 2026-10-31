import { useEffect, useState } from "react";
import { Bot, Eye, Play, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase as typed } from "@/integrations/supabase/client";
import { callFunction } from "@/lib/functions";

const supabase: any = typed;
const KEY = "auto_tasks";

interface Settings { enabled: boolean; deadline_days: number; reminder_days: number; pay_after_week: number; pay_amount: number | null; pay_title: string; review_mode: "off" | "suggest" | "auto"; approve_min: number; reject_below: number }
const DEFAULTS: Settings = { enabled: false, deadline_days: 5, reminder_days: 2, pay_after_week: 3, pay_amount: null, pay_title: "Internship certificate & verification fee", review_mode: "suggest", approve_min: 70, reject_below: 40 };

/** Switch + settings for the automatic weekly task release, reminder e-mails and the week-3 payment request. */
const AutoTasksPanel = () => {
  const { toast } = useToast();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    supabase.from("website_content").select("metadata").eq("section_key", KEY).maybeSingle().then(({ data }: any) => {
      if (data?.metadata) setS({ ...DEFAULTS, ...data.metadata });
    });
  }, []);

  const save = async (next: Settings, quiet = false) => {
    const { error } = await supabase.from("website_content").update({ metadata: next }).eq("section_key", KEY);
    if (error) return toast({ title: "Could not save", description: error.message, variant: "destructive" });
    setS(next);
    if (!quiet) toast({ title: "Saved" });
  };

  const run = async (mode: "preview" | "run_now") => {
    if (mode === "run_now" && !window.confirm("This will create the due tasks and send e-mails to interns right now. Continue?")) return;
    setBusy(mode); setResult(null);
    const { data, error } = await callFunction("task-automation", { mode });
    setBusy(null);
    if (error) return toast({ title: "Could not run", description: error, variant: "destructive" });
    setResult(data);
  };

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> Automatic tasks &amp; reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-muted-foreground">
          Every morning (6:00 AM IST) each intern automatically gets the next week of their domain plan, starting from their internship start date
          (a 1-month internship gets 4 weeks). Each week is due {s.deadline_days} days after it is released. Interns get an e-mail when tasks are released,
          a reminder {s.reminder_days} days before the deadline, and overdue reminders. When Weeks 1&ndash;{s.pay_after_week} are all submitted, a payment request is created
          on their profile and e-mailed. All tasks are marked compulsory.
        </p>
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
          <Label htmlFor="auto-on" className="font-semibold">Automation is {s.enabled ? "ON" : "OFF"}</Label>
          <Switch id="auto-on" checked={s.enabled} onCheckedChange={(v) => void save({ ...s, enabled: v }, true).then(() => toast({ title: v ? "Automation switched on" : "Automation switched off" }))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label className="text-xs">Deadline (days)</Label><Input type="number" min={1} value={s.deadline_days} onChange={(e) => setS({ ...s, deadline_days: Number(e.target.value) })} /></div>
          <div><Label className="text-xs">Remind before (days)</Label><Input type="number" min={1} value={s.reminder_days} onChange={(e) => setS({ ...s, reminder_days: Number(e.target.value) })} /></div>
          <div><Label className="text-xs">Payment after week</Label><Input type="number" min={1} max={8} value={s.pay_after_week} onChange={(e) => setS({ ...s, pay_after_week: Number(e.target.value) })} /></div>
          <div><Label className="text-xs">Payment amount (₹)</Label><Input type="number" min={0} placeholder="e.g. 499" value={s.pay_amount ?? ""} onChange={(e) => setS({ ...s, pay_amount: e.target.value === "" ? null : Number(e.target.value) })} /></div>
        </div>
        <div><Label className="text-xs">Payment title</Label><Input value={s.pay_title} onChange={(e) => setS({ ...s, pay_title: e.target.value })} /></div>
        <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/5 p-3 space-y-2">
          <Label className="font-semibold text-indigo-600">AI submission checker</Label>
          <Select value={s.review_mode} onValueChange={(v) => setS({ ...s, review_mode: v as Settings["review_mode"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off: admin reviews everything</SelectItem>
              <SelectItem value="suggest">Suggest: AI checks, admin applies the verdict</SelectItem>
              <SelectItem value="auto">Auto: AI approves or rejects clear cases</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Approve at score ≥</Label><Input type="number" min={50} max={100} value={s.approve_min} onChange={(e) => setS({ ...s, approve_min: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Reject below score</Label><Input type="number" min={0} max={60} value={s.reject_below} onChange={(e) => setS({ ...s, reject_below: Number(e.target.value) })} /></div>
          </div>
          <p className="text-[11px] text-muted-foreground">Runs every 15 minutes on new submissions. Unclear cases (design files, very little code, middle scores) always stay for you to decide. In Auto mode the intern is e-mailed the result. You can still approve or reject manually at any time from Submissions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => void save(s)}><Save className="w-3.5 h-3.5 mr-1" /> Save settings</Button>
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => void run("preview")}><Eye className="w-3.5 h-3.5 mr-1" /> {busy === "preview" ? "Checking…" : "Preview (no e-mails)"}</Button>
          <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => void run("run_now")}><Play className="w-3.5 h-3.5 mr-1" /> {busy === "run_now" ? "Running…" : "Run now"}</Button>
        </div>
        {!s.pay_amount && <p className="text-xs text-amber-600">Set the payment amount, or the payment request will not be created.</p>}
        {result && (
          <div className="rounded-lg bg-muted/60 p-3 text-xs space-y-1 max-h-60 overflow-auto">
            {result.skipped ? <p>{result.skipped}</p> : (
              <>
                <p className="font-semibold">{result.preview ? "Preview: this is what would happen" : "Done"}</p>
                <p>New tasks: {result.tasksInserted} {result.preview ? "" : `· e-mails sent: ${result.emails}`}</p>
                {result.released?.length > 0 && <p><b>Tasks released</b><br />{result.released.join("; ")}</p>}
                {result.reminders?.length > 0 && <p><b>Reminders</b><br />{result.reminders.join("; ")}</p>}
                {result.payments?.length > 0 && <p><b>Payment requests</b><br />{result.payments.join("; ")}</p>}
                {result.errors?.length > 0 && <p className="text-destructive"><b>Problems</b><br />{result.errors.join("; ")}</p>}
                {!result.released?.length && !result.reminders?.length && !result.payments?.length && !result.errors?.length && <p>Nothing to do right now.</p>}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default AutoTasksPanel;
