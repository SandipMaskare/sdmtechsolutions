import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lang } from "@/lib/codeRunner";
import { DOMAINS, findDomain } from "@/data/internshipPlan";
import { LAB_DOMAINS } from "@/data/codeLabDomains";
import FilePreviewButtons from "@/components/shared/FilePreviewButtons";
import CodeRunner from "./CodeRunner";
import AiCodeChat from "./AiCodeChat";
import SubmissionCode from "./SubmissionCode";

const SAMPLES: Record<Lang, string> = {
  javascript: "const nums = [3, 1, 2];\nconsole.log('Sorted:', nums.sort());",
  python: "name = input('Name: ') or 'SDM'\nprint('Hello,', name)\nprint(sum(range(1, 11)))",
  html: "<h1>Hello SDM</h1>\n<button onclick=\"this.textContent='Clicked!'\">Click me</button>",
};
const LANG_LABEL: Record<Lang, string> = { javascript: "JavaScript", python: "Python", html: "HTML" };
const CODE_FILE = /\.(zip|py|js|mjs|html?|java|c|cpp|css|json|txt|ipynb)$/i;

interface Row { id: string; task_id: string; submitted_by: string; file_url: string | null; external_link: string | null; comments: string | null; submitted_at: string; review_status: string | null; task_title: string; who: string }

/** Admin Code Lab, organised by internship domain: submissions to check, a checklist, a domain-aware AI and a practice area. */
const CodeLab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [domainKey, setDomainKey] = useState(DOMAINS[0].key);
  const [tab, setTab] = useState<"subs" | "practice">("subs");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Row | null>(null);
  const [ticks, setTicks] = useState<boolean[]>([]);
  const [comment, setComment] = useState("");
  const [lang, setLang] = useState<Lang>("python");
  const [code, setCode] = useState(SAMPLES.python);
  const [output, setOutput] = useState("");

  const plan = DOMAINS.find((d) => d.key === domainKey)!;
  const lab = LAB_DOMAINS.find((d) => d.key === domainKey)!;

  const load = useCallback(async () => {
    setLoading(true);
    const { data: subs } = await supabase.from("task_submissions").select("id, task_id, submitted_by, file_url, external_link, comments, submitted_at, review_status").order("submitted_at", { ascending: false }).limit(400);
    const list = (subs as any[]) || [];
    const taskIds = [...new Set(list.map((s) => s.task_id))];
    const userIds = [...new Set(list.map((s) => s.submitted_by))];
    const [{ data: ts }, { data: ps }] = await Promise.all([
      taskIds.length ? supabase.from("tasks").select("id, title, domain").in("id", taskIds) : Promise.resolve({ data: [] as any[] }),
      userIds.length ? supabase.from("profiles").select("user_id, full_name, internship_domain").in("user_id", userIds) : Promise.resolve({ data: [] as any[] }),
    ]);
    const tm: Record<string, any> = {}; (ts || []).forEach((t: any) => (tm[t.id] = t));
    const pm: Record<string, any> = {}; (ps || []).forEach((p: any) => (pm[p.user_id] = p));
    setRows(list.map((s) => {
      const dom = findDomain(tm[s.task_id]?.domain)?.key || findDomain(pm[s.submitted_by]?.internship_domain)?.key || "";
      return { ...s, task_title: tm[s.task_id]?.title || "Task", who: pm[s.submitted_by]?.full_name || "Intern", _dom: dom };
    }));
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const mine = useMemo(() => rows.filter((r: any) => r._dom === domainKey), [rows, domainKey]);
  const pending = mine.filter((r) => !r.review_status || r.review_status === "pending");
  const shown = showAll ? mine : pending;

  useEffect(() => { setOpen(null); setLang(lab.langs[0] || "python"); setCode(SAMPLES[lab.langs[0] || "python"]); setOutput(""); setTab("subs"); }, [domainKey]);
  useEffect(() => { setTicks(lab.checklist.map(() => false)); setComment(""); }, [open?.id, domainKey]);

  const review = async (status: "approved" | "rejected") => {
    if (!open) return;
    const { error } = await supabase.from("task_submissions").update({ review_status: status, review_comments: comment, reviewed_at: new Date().toISOString(), reviewed_by: user?.id }).eq("id", open.id);
    if (error) return toast({ title: "Could not save", description: error.message, variant: "destructive" });
    await supabase.from("tasks").update({ status }).eq("id", open.task_id);
    toast({ title: status === "approved" ? "Approved" : "Sent back for changes" });
    setOpen(null);
    void load();
  };

  const taskText = open ? `Domain: ${plan.label}. ${lab.focus}\nTask title: ${open.task_title}${open.comments ? `\nIntern's note: ${open.comments}` : ""}${open.external_link ? `\nLink submitted: ${open.external_link}` : ""}` : "";
  const hasCode = !!open?.file_url && CODE_FILE.test(open.file_url);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Code Lab by domain</h2>
        <p className="text-sm text-muted-foreground">Pick a domain to see that domain's submissions, review checklist, AI reviewer and practice area. Runs JavaScript, Python and HTML in your browser.</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DOMAINS.map((d) => {
          const n = rows.filter((r: any) => r._dom === d.key && (!r.review_status || r.review_status === "pending")).length;
          return <button key={d.key} onClick={() => setDomainKey(d.key)} className={`px-3 py-1.5 rounded-full text-sm border ${domainKey === d.key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{d.label}{n > 0 && <span className="ml-1.5 text-xs opacity-80">({n})</span>}</button>;
        })}
      </div>
      <div className="flex gap-2 border-b border-border">
        {([["subs", `Submissions to check (${pending.length})`], ["practice", "Practice area"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 text-sm border-b-2 -mb-px ${tab === k ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      {tab === "subs" && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border text-xs">
              <span className="text-muted-foreground">{plan.label}</span>
              <label className="flex items-center gap-1.5 cursor-pointer"><Checkbox checked={showAll} onCheckedChange={(v) => setShowAll(!!v)} />Show reviewed too</label>
            </div>
            <div className="max-h-[520px] overflow-auto divide-y divide-border">
              {loading && <p className="p-3 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading…</p>}
              {!loading && shown.length === 0 && <p className="p-3 text-sm text-muted-foreground">{showAll ? "No submissions for this domain yet." : "Nothing waiting to be checked in this domain."}</p>}
              {shown.map((r) => (
                <button key={r.id} onClick={() => setOpen(r)} className={`w-full text-left p-3 text-sm hover:bg-muted ${open?.id === r.id ? "bg-primary/10" : ""}`}>
                  <div className="font-medium truncate">{r.who}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.task_title}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-1">
                    {r.review_status === "approved" ? <span className="text-green-600 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />Approved</span> : r.review_status === "rejected" ? <span className="text-red-600 flex items-center gap-0.5"><XCircle className="w-3 h-3" />Needs changes</span> : <span className="text-amber-600">Waiting</span>}
                    <span className="text-muted-foreground">· {new Date(r.submitted_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!open ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">{plan.label}: what to check</p>
              <ul className="list-disc pl-5 space-y-1">{lab.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="mt-3">Select a submission on the left to open it here.</p>
            </div>
          ) : (
            <div className="space-y-4 min-w-0">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <p className="font-semibold">{open.who} · {open.task_title}</p>
                {open.comments && <p className="text-sm text-muted-foreground">Intern's note: {open.comments}</p>}
                <div className="flex flex-wrap gap-2">
                  {open.file_url && <FilePreviewButtons bucket="task-submissions" path={open.file_url} label="Download" />}
                  {open.external_link && <a href={open.external_link} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><ExternalLink className="w-4 h-4 mr-1" />Open link</Button></a>}
                </div>
              </div>
              {hasCode && <div className="rounded-xl border border-border bg-card p-4"><SubmissionCode path={open.file_url!} task={taskText} onFeedback={setComment} /></div>}
              {!hasCode && <AiCodeChat task={taskText} code={open.comments || open.external_link || ""} onFeedback={setComment} />}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-sm font-semibold">Checklist for {plan.label}</p>
                {lab.checklist.map((c, i) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={ticks[i] || false} onCheckedChange={(v) => setTicks(ticks.map((x, j) => (j === i ? !!v : x)))} />{c}</label>
                ))}
                <Textarea rows={3} placeholder="Review comment for the intern (the AI's feedback message can be pasted here)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex flex-wrap gap-2 items-center">
                  <Button onClick={() => review("approved")} disabled={ticks.some((t) => !t) && !comment.trim()} title="Tick every item or add a comment"><CheckCircle2 className="w-4 h-4 mr-1" />Approve</Button>
                  <Button variant="outline" onClick={() => review("rejected")} disabled={!comment.trim()} title="Add a comment so the intern knows what to fix"><XCircle className="w-4 h-4 mr-1" />Needs changes</Button>
                  <span className="text-xs text-muted-foreground">{ticks.filter(Boolean).length}/{ticks.length} checked</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "practice" && (
        lab.langs.length === 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 text-sm space-y-2">
              <p className="font-semibold">{plan.label} has no code to run</p>
              <p className="text-muted-foreground">Check this domain from the submitted file or link. Use the AI on the right for a second opinion on written work, plans or descriptions you paste in.</p>
              <ul className="list-disc pl-5 text-muted-foreground">{lab.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            <AiCodeChat task={`Domain: ${plan.label}. ${lab.focus}`} code="" />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex gap-2">
                {lab.langs.map((l) => (
                  <button key={l} onClick={() => { setLang(l); setCode(SAMPLES[l]); setOutput(""); }} className={`px-3 py-1.5 rounded-full text-sm border ${lang === l ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{LANG_LABEL[l]}</button>
                ))}
              </div>
              <Textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} rows={16} className="font-mono text-xs leading-5" />
              <CodeRunner key={lang} lang={lang} code={code} onResult={setOutput} />
            </div>
            <AiCodeChat task={`Domain: ${plan.label}. ${lab.focus}`} code={`// Language: ${lang}\n${code}`} output={output} />
          </div>
        )
      )}
    </div>
  );
};
export default CodeLab;
