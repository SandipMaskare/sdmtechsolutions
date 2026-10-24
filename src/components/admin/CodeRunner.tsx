import { useState } from "react";
import { Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lang, RunResult, buildHtmlPreview, runCode } from "@/lib/codeRunner";

/** Run button + output panel for one piece of code (JavaScript, Python or an HTML page). */
const CodeRunner = ({ lang, code, files, base, onResult }: { lang: Lang | null; code: string; files?: Record<string, string>; base?: string; onResult?: (o: string) => void }) => {
  const [res, setRes] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [stdin, setStdin] = useState("");
  const [html, setHtml] = useState<string | null>(null);

  if (!lang) {
    return <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border p-3">This file type cannot run in the browser here. JavaScript, Python and HTML can. For Java, C or C++, ask the AI to explain the expected output, or run it on your computer.</p>;
  }
  const run = async () => {
    setBusy(true); setRes(null); setHtml(null);
    if (lang === "html") { setHtml(buildHtmlPreview(code, files || {}, base || "")); setBusy(false); onResult?.("(HTML page previewed)"); return; }
    const r = await runCode(lang, code, stdin);
    setRes(r); setBusy(false);
    onResult?.([r.out, r.err && "ERROR: " + r.err].filter(Boolean).join("\n"));
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={run} disabled={busy}>{busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}{lang === "html" ? "Preview page" : "Run code"}</Button>
        {(res || html) && <Button size="sm" variant="ghost" onClick={() => { setRes(null); setHtml(null); }}><Trash2 className="w-4 h-4 mr-1" />Clear</Button>}
        <span className="text-xs text-muted-foreground">Runs safely in your browser, nothing is sent anywhere.</span>
      </div>
      {lang === "python" && <Textarea rows={2} value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="Input for input() calls, one value per line (optional)" className="text-xs font-mono" />}
      {html != null && <iframe title="preview" sandbox="allow-scripts allow-forms allow-modals" srcDoc={html} className="w-full h-72 rounded-lg border border-border bg-white" />}
      {res && (
        <div className="rounded-lg bg-black text-green-300 font-mono text-xs p-3 max-h-64 overflow-auto whitespace-pre-wrap">
          {res.out || (!res.err && "(no output)")}
          {res.err && <div className="text-red-400 mt-1">{res.err}</div>}
          <div className="text-zinc-500 mt-2">Finished in {res.ms} ms{res.timedOut ? " (stopped)" : ""}</div>
        </div>
      )}
    </div>
  );
};
export default CodeRunner;
