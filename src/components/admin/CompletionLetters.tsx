import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Mail, FileArchive, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { callFunction } from "@/lib/functions";
import { OFFER_FONTS, blobToBase64, fmtDate } from "./offerLetterTemplate";
import { COMPLETION_CSS, CompletionItem, completionHtml, completionPdfName, completionToPdf } from "./completionLetterTemplate";

const today = () => new Date().toISOString().slice(0, 10);

// Name, Email, College, Course, Role, Start, End, ID, Gender (he/she)
function parseRows(text: string) {
  return text
    .split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .map((l) => {
      const c = (l.includes("\t") ? l.split("\t") : l.split(",")).map((x) => x.trim().replace(/^"|"$/g, ""));
      const g = (c[8] || "").toLowerCase();
      return {
        name: c[0] || "", email: c[1] || "", college: c[2] || "", course: c[3] || "", role: c[4] || "", start: c[5] || "", end: c[6] || "", id: c[7] || "",
        gender: (/^(f|she|female)/.test(g) ? "she" : /^(m|he|male)/.test(g) ? "he" : "they") as CompletionItem["gender"],
      };
    })
    .filter((r) => r.name && !/^name$/i.test(r.name));
}

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

const CompletionLetters = () => {
  const { toast } = useToast();
  const [ldate, setLdate] = useState(today());
  const [subject, setSubject] = useState("Your Internship Completion Letter – SDM Technology");
  const [rows, setRows] = useState("");
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    if (document.getElementById("offer-fonts")) return;
    const l = document.createElement("link");
    l.id = "offer-fonts"; l.rel = "stylesheet"; l.href = OFFER_FONTS;
    document.head.appendChild(l);
  }, []);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, ((wrap.current?.clientWidth ?? 744) - 8) / 744));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const items: CompletionItem[] = useMemo(
    () => parseRows(rows).map((r, i) => ({ ...r, id: r.id || `SDM/C/${i + 1}`, ldate })),
    [rows, ldate],
  );
  const shown: CompletionItem = items[Math.min(sel, items.length - 1)] ?? {
    id: "SDM/C/1", name: "Intern Name", email: "", college: "Your College", course: "B.Tech", role: "Web Development Intern", start: "2026-01-01", end: "2026-02-01", ldate, gender: "they",
  };

  const download = async (it: CompletionItem) => {
    setBusy(it.name);
    try { save(await completionToPdf(it), completionPdfName(it)); }
    catch (e: any) { toast({ title: "Could not create PDF", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };
  const zip = async () => {
    setBusy("zip");
    try {
      const { default: JSZip } = await import("jszip");
      const z = new JSZip();
      for (const it of items) z.file(completionPdfName(it), await completionToPdf(it));
      save(await z.generateAsync({ type: "blob" }), "SDM Completion Letters.zip");
    } catch (e: any) { toast({ title: "Could not create ZIP", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };
  const emailOne = async (it: CompletionItem): Promise<boolean> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(it.email)) { setStatus((s) => ({ ...s, [it.name]: "No valid email" })); return false; }
    setStatus((s) => ({ ...s, [it.name]: "Sending…" }));
    try {
      const pdf = await blobToBase64(await completionToPdf(it));
      const text = `Dear ${it.name},\n\nCongratulations on successfully completing your ${it.role} internship at SDM Technology (${fmtDate(it.start)} to ${fmtDate(it.end)}).\n\nPlease find your Internship Completion Letter (Intern ID: ${it.id}) attached.\n\nWe wish you all the best for your future. Please stay connected with us on LinkedIn for new opportunities.\n\nBest regards,\nHR Team – SDM Technology`;
      const { error } = await callFunction("send-email", {
        to: it.email, subject, text, template: "intern",
        attachments: [{ filename: completionPdfName(it), content: pdf, contentType: "application/pdf" }],
      });
      if (error) throw new Error(error);
      setStatus((s) => ({ ...s, [it.name]: "Sent ✓" }));
      return true;
    } catch (e: any) {
      setStatus((s) => ({ ...s, [it.name]: "Failed: " + (e?.message ?? "error") }));
      return false;
    }
  };
  const emailAll = async () => {
    if (!confirm(`Email a completion letter to ${items.length} intern(s)?`)) return;
    setBusy("all");
    let ok = 0;
    for (const it of items) if (status[it.name] !== "Sent ✓" && (await emailOne(it))) ok++;
    setBusy(null);
    toast({ title: `${ok} completion letter(s) sent` });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <style>{COMPLETION_CSS}</style>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-semibold">Completion letter generator</h3>
          <div><Label>Letter date</Label><Input type="date" value={ldate} onChange={(e) => setLdate(e.target.value)} /></div>
          <div><Label>Email subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div>
            <Label>Interns — one per line: Name, Email, College, Course, Role, Start, End, ID, Gender</Label>
            <Textarea rows={7} className="font-mono text-xs" value={rows} onChange={(e) => { setRows(e.target.value); setSel(0); }}
              placeholder={"Tanushree Dhoble, tanu@gmail.com, KDK College of Engineering Nagpur, B.Tech, Machine Learning In Python Intern, 2025-05-22, 2025-06-24, SDM/C3-250631, F"} />
            <p className="text-xs text-muted-foreground mt-1">Copy rows from your Google Sheet. Gender is F or M (used for she/her or he/his); leave it empty for they/their. Start and end dates are written as YYYY-MM-DD.</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold mb-2">Letters ({items.length})</h3>
          {items.length === 0 ? <p className="text-sm text-muted-foreground">Paste your interns above.</p> : (
            <div className="divide-y divide-border">
              {items.map((it, i) => (
                <div key={i} className="py-2 flex items-center gap-2 text-sm">
                  <button className="flex-1 text-left min-w-0" onClick={() => setSel(i)}>
                    <div className="font-medium truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{it.role}{it.email ? ` · ${it.email}` : ""}</div>
                    {status[it.name] && (
                      <div className={`text-xs flex items-center gap-1 ${status[it.name].startsWith("Failed") || status[it.name] === "No valid email" ? "text-destructive" : "text-muted-foreground"}`}>
                        {status[it.name] === "Sent ✓" ? <CheckCircle2 className="w-3 h-3" /> : status[it.name].startsWith("Failed") ? <AlertCircle className="w-3 h-3" /> : null}
                        {status[it.name]}
                      </div>
                    )}
                  </button>
                  <Button size="sm" variant="outline" disabled={!!busy} onClick={() => download(it)} title="Download PDF">
                    {busy === it.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" disabled={!!busy} title="Email PDF to intern" onClick={async () => { setBusy(it.name); await emailOne(it); setBusy(null); }}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" disabled={!items.length || !!busy} onClick={zip}>
              {busy === "zip" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <FileArchive className="w-4 h-4 mr-1" />} Download all (ZIP)
            </Button>
            <Button size="sm" variant="secondary" disabled={!items.length || !!busy} onClick={emailAll}>
              {busy === "all" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Mail className="w-4 h-4 mr-1" />} Email all
            </Button>
          </div>
        </div>
      </div>
      <div ref={wrap} className="rounded-xl border border-border bg-card p-2 overflow-auto">
        <div style={{ width: 744 * scale, height: 1052 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 744 }} dangerouslySetInnerHTML={{ __html: completionHtml(shown) }} />
        </div>
      </div>
    </div>
  );
};

export default CompletionLetters;
