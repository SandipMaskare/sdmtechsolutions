import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fileExt, fileKind, fileName, signedFileUrl } from "@/lib/files";

const decode = (s: string) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const MAX_TEXT = 400000;

type Table = string[][];

const parseCsv = (txt: string): Table =>
  txt.split(/\r?\n/).filter(Boolean).slice(0, 300).map((l) => {
    const out: string[] = []; let cur = ""; let q = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') { if (q && l[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
      else if ((c === "," || c === "\t") && !q) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur); return out;
  });

const TableView = ({ rows }: { rows: Table }) => (
  <div className="overflow-auto h-full bg-background">
    <table className="text-xs border-collapse min-w-full">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i === 0 ? "bg-muted font-medium sticky top-0" : ""}>
            {r.map((c, j) => <td key={j} className="border border-border px-2 py-1 whitespace-pre-wrap align-top max-w-[320px]">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Text = ({ text, name }: { text: string; name: string }) => {
  const ext = fileExt(name);
  const [mode, setMode] = useState<"source" | "rendered">(ext === "html" || ext === "htm" ? "rendered" : "source");
  if (ext === "csv" || ext === "tsv") return <TableView rows={parseCsv(text)} />;
  const isHtml = ext === "html" || ext === "htm";
  return (
    <div className="h-full flex flex-col bg-background">
      {isHtml && (
        <div className="flex gap-1 p-2 border-b border-border text-xs">
          {(["rendered", "source"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-2 py-1 rounded ${mode === m ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m === "rendered" ? "Page preview" : "Source code"}</button>
          ))}
        </div>
      )}
      {isHtml && mode === "rendered" ? (
        <iframe sandbox="allow-scripts" srcDoc={text} title={name} className="flex-1 w-full bg-white" />
      ) : (
        <pre className="flex-1 overflow-auto p-3 text-xs leading-5 whitespace-pre-wrap break-words"><code>{text.slice(0, MAX_TEXT)}{text.length > MAX_TEXT ? "\n\n… (file cut here, download to see the rest)" : ""}</code></pre>
      )}
    </div>
  );
};

const Doc = ({ paras }: { paras: string[] }) => (
  <div className="h-full overflow-auto bg-background p-5 text-sm space-y-2">
    <p className="text-xs text-muted-foreground">Text preview. Layout, images and fonts are not shown; download the file to see the full document.</p>
    {paras.map((p, i) => <p key={i}>{p}</p>)}
  </div>
);

const ZipView = ({ zip }: { zip: any }) => {
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir && !n.startsWith("__MACOSX")).sort();
  const [sel, setSel] = useState<string | null>(null);
  const [content, setContent] = useState<{ kind: "text" | "image" | "none"; v: string } | null>(null);
  useEffect(() => {
    if (!sel) return;
    let off = false; let url: string | null = null;
    (async () => {
      setContent(null);
      const k = fileKind(sel);
      if (k === "text") { const t = await zip.files[sel].async("string"); if (!off) setContent({ kind: "text", v: t }); }
      else if (k === "image") {
        const b = await zip.files[sel].async("blob"); url = URL.createObjectURL(b);
        if (!off) setContent({ kind: "image", v: url });
      } else if (!off) setContent({ kind: "none", v: "" });
    })();
    return () => { off = true; if (url) URL.revokeObjectURL(url); };
  }, [sel, zip]);
  return (
    <div className="grid md:grid-cols-[240px_1fr] h-full bg-background">
      <div className="border-r border-border overflow-auto text-xs max-h-48 md:max-h-none">
        <p className="p-2 text-muted-foreground">{names.length} files in this zip. Click one to open it.</p>
        {names.map((n) => (
          <button key={n} onClick={() => setSel(n)} className={`block w-full text-left px-2 py-1.5 truncate hover:bg-muted ${n === sel ? "bg-primary/10 text-primary font-medium" : ""}`} title={n}>{n}</button>
        ))}
      </div>
      <div className="min-h-0 overflow-auto">
        {!sel && <p className="p-4 text-sm text-muted-foreground">Select a file on the left.</p>}
        {sel && !content && <p className="p-4 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Opening…</p>}
        {content?.kind === "text" && <Text text={content.v} name={sel!} />}
        {content?.kind === "image" && <img src={content.v} alt={sel!} className="max-w-full mx-auto" />}
        {content?.kind === "none" && <p className="p-4 text-sm text-muted-foreground">No preview for this file type inside the zip. Download the zip to open it.</p>}
      </div>
    </div>
  );
};

/** Opens almost any submitted file inside the page: images, PDF, video, audio, text/code, CSV, Word, PowerPoint, Excel and ZIP. */
const FileViewer = ({ bucket, path }: { bucket: string; path: string }) => {
  const kind = fileKind(path);
  const name = fileName(path);
  const [state, setState] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    setState(null); setErr(null);
    (async () => {
      try {
        if (kind === "image" || kind === "pdf" || kind === "video" || kind === "audio") {
          const url = await signedFileUrl(bucket, path);
          if (!url) throw new Error("Could not open the file");
          if (!off) setState({ url });
          return;
        }
        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (error || !data) throw new Error(error?.message || "Could not open the file");
        if (kind === "text") { if (!off) setState({ text: await data.text() }); return; }
        const { default: JSZip } = await import("jszip");
        const zip = await JSZip.loadAsync(data);
        if (kind === "zip") { if (!off) setState({ zip }); return; }
        if (kind === "docx") {
          const xml = await zip.file("word/document.xml")!.async("string");
          const paras = xml.split("</w:p>").map((p) => decode(p.replace(/<w:tab\/>/g, "\t").replace(/<w:br\/>/g, "\n").replace(/<[^>]+>/g, ""))).filter((p) => p.trim());
          if (!off) setState({ paras }); return;
        }
        if (kind === "pptx") {
          const slides = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")));
          const paras: string[] = [];
          for (let i = 0; i < slides.length; i++) {
            const xml = await zip.file(slides[i])!.async("string");
            paras.push(`— Slide ${i + 1} —`);
            xml.split("</a:p>").forEach((p) => { const t = decode((p.match(/<a:t>([^<]*)<\/a:t>/g) || []).map((m) => m.replace(/<[^>]+>/g, "")).join("")); if (t.trim()) paras.push(t); });
          }
          if (!off) setState({ paras }); return;
        }
        if (kind === "xlsx") {
          const sst = zip.file("xl/sharedStrings.xml");
          const strings: string[] = sst ? (await sst.async("string")).split("</si>").slice(0, -1).map((si) => decode((si.match(/<t[^>]*>([^<]*)<\/t>/g) || []).map((m) => m.replace(/<[^>]+>/g, "")).join(""))) : [];
          const sheet = Object.keys(zip.files).filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0];
          const xml = await zip.file(sheet)!.async("string");
          const rows: Table = [];
          (xml.match(/<row[\s\S]*?<\/row>/g) || []).slice(0, 300).forEach((r) => {
            const row: string[] = [];
            (r.match(/<c [^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) || []).forEach((c) => {
              const ref = (c.match(/r="([A-Z]+)\d+"/) || [])[1] || "A";
              const col = ref.split("").reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
              const v = (c.match(/<v>([^<]*)<\/v>/) || [])[1] ?? (c.match(/<t[^>]*>([^<]*)<\/t>/) || [])[1] ?? "";
              row[col] = /t="s"/.test(c) ? strings[parseInt(v)] ?? "" : decode(v);
            });
            rows.push(Array.from(row, (x) => x ?? ""));
          });
          if (!off) setState({ rows }); return;
        }
      } catch (e: any) { if (!off) setErr(e?.message || "Could not open the file"); }
    })();
    return () => { off = true; };
  }, [bucket, path, kind]);

  if (err) return <p className="p-4 text-sm text-destructive">{err}. Use Download instead.</p>;
  if (!state) return <p className="p-4 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Opening the file…</p>;
  if (state.url) {
    if (kind === "image") return <img src={state.url} alt={name} className="w-full h-full object-contain bg-muted" />;
    if (kind === "video") return <video src={state.url} controls className="w-full h-full bg-black" />;
    if (kind === "audio") return <div className="p-6 bg-background"><audio src={state.url} controls className="w-full" /></div>;
    return <iframe src={state.url} title={name} className="w-full h-full bg-white" />;
  }
  if (state.text !== undefined) return <Text text={state.text} name={name} />;
  if (state.zip) return <ZipView zip={state.zip} />;
  if (state.rows) return <TableView rows={state.rows} />;
  if (state.paras) return <Doc paras={state.paras} />;
  return null;
};
export default FileViewer;
