import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Mail, FileArchive, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { callFunction } from "@/lib/functions";
import {
  OFFER_CSS, OFFER_FONTS, OfferItem, blobToBase64, letterHtml, scheduleHtml, letterToPdf, pdfName,
} from "./offerLetterTemplate";

const today = () => new Date().toISOString().slice(0, 10);

function parseRows(text: string) {
  return text
    .split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .map((l) => {
      const c = (l.includes("\t") ? l.split("\t") : l.split(",")).map((x) => x.trim().replace(/^"|"$/g, ""));
      return { name: c[0] || "", email: c[1] || "", role: c[2] || "", start: c[3] || "", end: c[4] || "", id: c[5] || "" };
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

const OfferLetters = () => {
  const { toast } = useToast();
  const [ldate, setLdate] = useState(today());
  const [days, setDays] = useState("2");
  const [drole, setDrole] = useState("Java Programming Intern");
    const [dstart, setDstart] = useState("");
  const [dend, setDend] = useState("");
  const [startNo, setStartNo] = useState("1");
  const [fee, setFee] = useState("149");
  const [subject, setSubject] = useState("Your Internship Offer Letter – SDM Technology");
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

  const items: OfferItem[] = useMemo(
    () => parseRows(rows).map((r, i) => ({
      ...r, fee, id: r.id || `SDM/C/${(parseInt(startNo, 10) || 1) + i}`,
      role: r.role || drole, start: r.start || dstart, end: r.end || dend, ldate, days,
    })),
    [rows, drole, dstart, dend, ldate, days, startNo, fee],
  );
  const shown: OfferItem = items[Math.min(sel, items.length - 1)] ?? {
    id: `SDM/C/${parseInt(startNo, 10) || 1}`, fee, name: "Intern Name", email: "", role: drole, start: dstart, end: dend, ldate, days,
  };

  const download = async (it: OfferItem) => {
    setBusy(it.name);
    try { save(await letterToPdf(it), pdfName(it)); }
    catch (e: any) { toast({ title: "Could not create PDF", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };

  const zip = async () => {
    setBusy("zip");
    try {
      const { default: JSZip } = await import("jszip");
      const z = new JSZip();
      for (const it of items) z.file(pdfName(it), await letterToPdf(it));
      save(await z.generateAsync({ type: "blob" }), "SDM Offer Letters.zip");
    } catch (e: any) { toast({ title: "Could not create ZIP", description: e?.message, variant: "destructive" }); }
    setBusy(null);
  };

  const emailOne = async (it: OfferItem): Promise<boolean> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(it.email)) {
      setStatus((s) => ({ ...s, [it.name]: "No valid email" }));
      return false;
    }
    setStatus((s) => ({ ...s, [it.name]: "Sending…" }));
    try {
      const pdf = await blobToBase64(await letterToPdf(it));
      const text =
        `Dear ${it.name},\n\nCongratulations! Please find attached your offer letter with Schedule A (Intern ID: ${it.id}) for the ${it.role} internship at SDM Technology ` +
        `(${it.start ? it.start : "start date"} to ${it.end ? it.end : "end date"}).\n\nKindly review it and accept it within ${it.days} days.\n\n` +
        `Best regards,\nHR Team – SDM Technology`;
      const { error } = await callFunction("send-email", {
        to: it.email, subject, text, template: "intern",
        attachments: [{ filename: pdfName(it), content: pdf, contentType: "application/pdf" }],
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
    if (!confirm(`Email an offer letter to ${items.length} intern(s)?`)) return;
    setBusy("all");
    let ok = 0;
    for (const it of items) if (status[it.name] !== "Sent ✓" && (await emailOne(it))) ok++;
    setBusy(null);
    toast({ title: `${ok} offer letter(s) sent` });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <style>{OFFER_CSS}</style>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-semibold">Offer letter generator</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Letter date</Label><Input type="date" value={ldate} onChange={(e) => setLdate(e.target.value)} /></div>
            <div><Label>Accept within (days)</Label><Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} /></div>
            <div><Label>Default internship</Label><Input value={drole} onChange={(e) => setDrole(e.target.value)} /></div>
            <div><Label>First Intern ID number (SDM/C/…)</Label><Input type="number" min={1} value={startNo} onChange={(e) => setStartNo(e.target.value)} /></div>
            <div><Label>Document processing fee (₹)</Label><Input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} /></div>
            <div><Label>Default start date</Label><Input type="date" value={dstart} onChange={(e) => setDstart(e.target.value)} /></div>
            <div><Label>Default end date</Label><Input type="date" value={dend} onChange={(e) => setDend(e.target.value)} /></div>
          </div>
          <div><Label>Email subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div>
            <Label>Interns — one per line: Name, Email, Role, Start, End, ID(optional)</Label>
            <Textarea rows={6} className="font-mono text-xs" value={rows} onChange={(e) => { setRows(e.target.value); setSel(0); }}
              placeholder={"Rahul Patil, rahul@gmail.com, Web Development Intern, 2026-11-01, 2026-12-01\nSneha More, sneha@gmail.com, , ,"} />
            <p className="text-xs text-muted-foreground mt-1">Copy rows straight from your Google Sheet. Leave role/dates empty to use the defaults. IDs are numbered automatically (SDM/C/1, SDM/C/2…) from the number above, or type your own in the 6th column.</p>
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
                  <Button size="sm" variant="outline" disabled={!!busy} title="Email PDF to intern"
                    onClick={async () => { setBusy(it.name); await emailOne(it); setBusy(null); }}>
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

      <div ref={wrap} className="rounded-xl border border-border bg-card p-2 overflow-auto space-y-3">
        {[letterHtml(shown), scheduleHtml(shown)].map((h, i) => (
          <div key={i} style={{ width: 744 * scale, height: 1052 * scale }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 744 }} dangerouslySetInnerHTML={{ __html: h }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferLetters;
