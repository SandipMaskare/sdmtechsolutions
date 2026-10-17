import { useCallback, useEffect, useRef, useState } from "react";
import { Inbox, Send, Trash2, RefreshCw, Reply, PenSquare, Paperclip, ExternalLink, Loader2, MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { callFunction } from "@/lib/functions";
import EmailComposer from "./EmailComposer";

interface Row { uid: number; subject: string; from: string; date: string | null; seen: boolean }
interface Full {
  uid: number; subject: string; from: string; fromAddress: string; replyTo: string; to: string; date: string | null;
  text: string; html: string | null;
  attachments: { index: number; filename: string; size: number; contentType: string }[];
}

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "sent", label: "Sent", icon: Send },
  { id: "spam", label: "Spam", icon: Mail },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const when = (d: string | null) => {
  if (!d) return "";
  const x = new Date(d);
  const same = x.toDateString() === new Date().toDateString();
  return same ? x.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : x.toLocaleDateString([], { day: "numeric", month: "short" });
};
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

const MailInbox = () => {
  const { toast } = useToast();
  const [folder, setFolder] = useState("inbox");
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Full | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [mode, setMode] = useState<"read" | "reply" | "compose">("read");
  const seq = useRef(0);

  const load = useCallback(async (f = folder, p = 1, quiet = false) => {
    const my = ++seq.current;
    if (!quiet) setLoading(true);
    const { data, error: err } = await callFunction<{ total: number; messages: Row[] }>("mail-inbox", { action: "list", folder: f, page: p });
    if (my !== seq.current) return;
    setLoading(false);
    if (err || !data) { setError(err ?? "Could not load mail"); return; }
    setError(null);
    setTotal(data.total);
    setRows((prev) => (p === 1 ? data.messages : [...prev, ...data.messages]));
    setPage(p);
  }, [folder]);

  useEffect(() => { setOpen(null); setMode("read"); setRows([]); load(folder, 1); }, [folder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === "visible" && page === 1) load(folder, 1, true); }, 60000);
    return () => clearInterval(t);
  }, [folder, page, load]);

  const openMail = async (r: Row) => {
    setOpening(r.uid); setMode("read");
    const { data, error: err } = await callFunction<Full>("mail-inbox", { action: "read", folder, uid: r.uid });
    setOpening(null);
    if (err || !data) { toast({ title: "Could not open email", description: err ?? "", variant: "destructive" }); return; }
    setOpen(data);
    setRows((prev) => prev.map((x) => (x.uid === r.uid ? { ...x, seen: true } : x)));
  };

  const trash = async () => {
    if (!open || !confirm("Move this email to Trash?")) return;
    const { error: err } = await callFunction("mail-inbox", { action: "trash", folder, uid: open.uid });
    if (err) { toast({ title: "Could not delete", description: err, variant: "destructive" }); return; }
    setRows((prev) => prev.filter((x) => x.uid !== open.uid));
    setOpen(null);
  };

  const download = async (a: Full["attachments"][number]) => {
    if (!open) return;
    const { data, error: err } = await callFunction<{ filename: string; contentType: string; content: string }>("mail-inbox", { action: "attachment", folder, uid: open.uid, index: a.index });
    if (err || !data) { toast({ title: "Download failed", description: err ?? "", variant: "destructive" }); return; }
    const bin = atob(data.content);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: data.contentType || "application/octet-stream" }));
    const el = document.createElement("a");
    el.href = url; el.download = data.filename; el.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const srcDoc = open?.html
    ? `<base target="_blank"><style>body{font:14px/1.5 system-ui,sans-serif;color:#222;margin:12px;word-wrap:break-word}img{max-width:100%;height:auto}</style>${open.html}`
    : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground mr-auto">Mailbox</h2>
        <Button size="sm" onClick={() => { setMode("compose"); setOpen(null); }}><PenSquare className="w-4 h-4 mr-1" /> New email</Button>
        <Button size="sm" variant="outline" onClick={() => load(folder, 1)} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <a href="https://mail.google.com/" target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Open Gmail</a>
        </Button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {FOLDERS.map((f) => (
          <Button key={f.id} size="sm" variant={folder === f.id ? "default" : "outline"} onClick={() => setFolder(f.id)}>
            <f.icon className="w-4 h-4 mr-1" /> {f.label}
          </Button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <p className="font-medium text-destructive">{error}</p>
          <p className="text-muted-foreground mt-1">
            In Supabase → Edge Functions → Secrets add <code>MAIL_USER</code> (your mailbox address) and <code>MAIL_APP_PASSWORD</code> (a Google app password), then refresh.
          </p>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[340px_1fr]">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {rows.length === 0 && !loading && !error && <p className="p-4 text-sm text-muted-foreground">No emails here.</p>}
            {loading && rows.length === 0 && <p className="p-4 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}
            {rows.map((r) => (
              <button key={r.uid} onClick={() => openMail(r)}
                className={`w-full text-left px-3 py-2.5 hover:bg-muted/50 ${open?.uid === r.uid ? "bg-muted" : ""}`}>
                <div className="flex items-center gap-2">
                  {!r.seen && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  <span className={`truncate text-sm ${r.seen ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{r.from.replace(/<.*>/, "").trim() || r.from}</span>
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{when(r.date)}</span>
                  {opening === r.uid && <Loader2 className="w-3 h-3 animate-spin" />}
                </div>
                <div className={`truncate text-sm ${r.seen ? "text-muted-foreground" : "text-foreground"}`}>{r.subject}</div>
              </button>
            ))}
            {rows.length < total && rows.length > 0 && (
              <button className="w-full p-3 text-sm text-primary hover:bg-muted/50" onClick={() => load(folder, page + 1)} disabled={loading}>
                {loading ? "Loading…" : `Load older (${total - rows.length} more)`}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 min-h-[300px]">
          {mode === "compose" && (
            <div>
              <h3 className="font-semibold mb-3">New email</h3>
              <EmailComposer onSent={() => { setMode("read"); toast({ title: "Email sent" }); }} />
            </div>
          )}
          {mode !== "compose" && !open && (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <MailOpen className="w-8 h-8" /> <p className="text-sm">Select an email to read it</p>
            </div>
          )}
          {mode !== "compose" && open && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 mr-auto">
                  <h3 className="font-semibold text-lg break-words">{open.subject}</h3>
                  <p className="text-sm text-muted-foreground break-words">From: {open.from}</p>
                  {open.to && <p className="text-xs text-muted-foreground break-words">To: {open.to}</p>}
                  {open.date && <p className="text-xs text-muted-foreground">{new Date(open.date).toLocaleString()}</p>}
                </div>
                {folder !== "sent" && <Button size="sm" onClick={() => setMode(mode === "reply" ? "read" : "reply")}><Reply className="w-4 h-4 mr-1" /> Reply</Button>}
                <Button size="sm" variant="outline" onClick={trash} title="Move to Trash"><Trash2 className="w-4 h-4" /></Button>
              </div>

              {open.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {open.attachments.map((a) => (
                    <Button key={a.index} size="sm" variant="outline" onClick={() => download(a)}>
                      <Paperclip className="w-3.5 h-3.5 mr-1" /> {a.filename} <span className="ml-1 text-xs text-muted-foreground">{kb(a.size)}</span>
                    </Button>
                  ))}
                </div>
              )}

              {mode === "reply" && (
                <div className="rounded-lg border border-border p-3">
                  <EmailComposer
                    initialTo={open.replyTo}
                    initialSubject={/^re:/i.test(open.subject) ? open.subject : `Re: ${open.subject}`}
                    original={{ from: open.from, subject: open.subject, message: open.text.slice(0, 6000) }}
                    onSent={() => { setMode("read"); toast({ title: "Reply sent" }); }}
                  />
                </div>
              )}

              {srcDoc ? (
                <iframe title="email" sandbox="allow-popups" srcDoc={srcDoc} className="w-full h-[55vh] rounded-lg border border-border bg-white" />
              ) : (
                <pre className="whitespace-pre-wrap break-words text-sm font-sans max-h-[55vh] overflow-y-auto">{open.text}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MailInbox;
