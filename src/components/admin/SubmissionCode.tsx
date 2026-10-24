import { useEffect, useMemo, useState } from "react";
import { FileCode2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { langOf } from "@/lib/codeRunner";
import CodeRunner from "./CodeRunner";
import AiCodeChat from "./AiCodeChat";

const TEXT_EXT = /\.(js|jsx|ts|tsx|mjs|py|ipynb|html?|css|scss|json|md|txt|java|c|cpp|h|cs|php|rb|go|rs|kt|swift|sql|sh|xml|yml|yaml|csv|env\.example|ini)$/i;
const SKIP = /(^|\/)(node_modules|\.git|__pycache__|dist|build|\.next|venv|\.venv)\//i;

/** Opens an intern's submitted .zip (or single file) so the admin can read, run and AI-review the code. */
const SubmissionCode = ({ path, task, onFeedback }: { path: string; task?: string; onFeedback?: (t: string) => void }) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [sel, setSel] = useState("");
  const [output, setOutput] = useState("");
  const [skipped, setSkipped] = useState(0);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const { data, error } = await supabase.storage.from("task-submissions").download(path);
        if (error || !data) throw new Error(error?.message || "Could not download the file");
        const found: Record<string, string> = {};
        let skip = 0;
        if (/\.zip$/i.test(path)) {
          const { default: JSZip } = await import("jszip");
          const zip = await JSZip.loadAsync(data);
          for (const [name, entry] of Object.entries(zip.files)) {
            if (entry.dir || SKIP.test(name) || name.startsWith("__MACOSX")) continue;
            if (!TEXT_EXT.test(name)) { skip++; continue; }
            const txt = await entry.async("string");
            if (txt.length > 300000) { skip++; continue; }
            found[name] = txt;
          }
        } else if (TEXT_EXT.test(path)) {
          found[path.split("/").pop() || "file"] = await data.text();
        } else throw new Error("This file type is not a code file. Download it instead.");
        if (off) return;
        setFiles(found); setSkipped(skip);
        const names = Object.keys(found);
        setSel(names.find((n) => /(^|\/)(main|index|app)\.(py|js|html)$/i.test(n)) || names.find((n) => langOf(n)) || names[0] || "");
      } catch (e: any) { if (!off) setErr(e?.message || "Could not open the code"); }
      if (!off) setLoading(false);
    })();
    return () => { off = true; };
  }, [path]);

  const names = useMemo(() => Object.keys(files).sort(), [files]);
  if (loading) return <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Opening the submitted code…</p>;
  if (err) return <p className="text-sm text-destructive">{err}</p>;
  if (!names.length) return <p className="text-sm text-muted-foreground">No readable code files were found in this upload{skipped ? ` (${skipped} non-code files skipped)` : ""}.</p>;
  const code = files[sel] || "";
  const base = sel.includes("/") ? sel.slice(0, sel.lastIndexOf("/") + 1) : "";

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{names.length} code file(s){skipped ? `, ${skipped} other files hidden (images, binaries)` : ""}. Pick a file to read or run it.</p>
      <div className="grid gap-3 md:grid-cols-[200px_1fr]">
        <div className="rounded-lg border border-border max-h-72 overflow-auto text-xs">
          {names.map((n) => (
            <button key={n} onClick={() => { setSel(n); setOutput(""); }} className={`w-full text-left px-2 py-1.5 flex items-center gap-1.5 hover:bg-muted ${n === sel ? "bg-primary/10 text-primary font-medium" : ""}`}>
              <FileCode2 className="w-3.5 h-3.5 shrink-0" /><span className="truncate" title={n}>{n}</span>
            </button>
          ))}
        </div>
        <pre className="rounded-lg border border-border bg-muted/40 p-3 text-xs overflow-auto max-h-72 leading-5"><code>{code.split("\n").map((l, i) => <div key={i}><span className="select-none text-muted-foreground inline-block w-8 text-right mr-3">{i + 1}</span>{l}</div>)}</code></pre>
      </div>
      <CodeRunner key={sel} lang={langOf(sel)} code={code} files={files} base={base} onResult={setOutput} />
      <AiCodeChat task={task} code={`// File: ${sel}\n${code}`} output={output} onFeedback={onFeedback} />
    </div>
  );
};
export default SubmissionCode;
