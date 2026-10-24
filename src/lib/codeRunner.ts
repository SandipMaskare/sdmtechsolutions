// Runs code safely inside the browser (a Web Worker that is killed after a timeout). No code leaves the admin's computer.
export type Lang = "javascript" | "python" | "html";
export interface RunResult { out: string; err: string; ms: number; timedOut?: boolean }

const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

const jsWorker = `
const fmt = (v) => { if (typeof v === 'string') return v; try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); } };
self.onmessage = async (e) => {
  const code = e.data.code;
  const say = (t, a) => postMessage({ t, s: a.map(fmt).join(' ') });
  console.log = (...a) => say('out', a); console.info = console.log; console.warn = (...a) => say('err', a); console.error = (...a) => say('err', a);
  try { const AF = Object.getPrototypeOf(async function(){}).constructor; await new AF(code)(); }
  catch (err) { postMessage({ t: 'err', s: String((err && err.stack) || err) }); }
  postMessage({ t: 'done' });
};`;

const pyWorker = (stdin: string) => `
importScripts('${PYODIDE}pyodide.js');
let py;
self.onmessage = async (e) => {
  try {
    if (!py) { postMessage({ t: 'out', s: '(loading Python for the first time, about 10 seconds...)' }); py = await loadPyodide({ indexURL: '${PYODIDE}' }); }
    const lines = ${JSON.stringify(stdin)}.split('\\n'); let i = 0;
    py.setStdin({ stdin: () => (i < lines.length ? lines[i++] : null) });
    py.setStdout({ batched: (s) => postMessage({ t: 'out', s }) });
    py.setStderr({ batched: (s) => postMessage({ t: 'err', s }) });
    try { await py.loadPackagesFromImports(e.data.code); } catch (_) {}
    await py.runPythonAsync(e.data.code);
  } catch (err) { postMessage({ t: 'err', s: String((err && err.message) || err) }); }
  postMessage({ t: 'done' });
};`;

export function runCode(lang: "javascript" | "python", code: string, stdin = "", timeoutMs = 20000): Promise<RunResult> {
  return new Promise((resolve) => {
    const src = lang === "python" ? pyWorker(stdin) : jsWorker;
    const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    const w = new Worker(url);
    const out: string[] = [], err: string[] = [];
    const t0 = performance.now();
    const finish = (timedOut = false) => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); resolve({ out: out.join("\n"), err: err.join("\n"), ms: Math.round(performance.now() - t0), timedOut }); };
    const timer = setTimeout(() => { err.push(`Stopped: the code ran longer than ${timeoutMs / 1000} seconds (possible infinite loop).`); finish(true); }, timeoutMs);
    w.onmessage = (e) => { const m = e.data; if (m.t === "out") out.push(m.s); else if (m.t === "err") err.push(m.s); else if (m.t === "done") finish(); };
    w.onerror = (e) => { err.push(e.message || "Worker error"); finish(); };
    w.postMessage({ code });
  });
}

/** Inlines linked .css/.js files from the project so an HTML page previews correctly. */
export function buildHtmlPreview(html: string, files: Record<string, string>, base = ""): string {
  const find = (ref: string) => {
    const clean = ref.replace(/^\.?\//, "").split(/[?#]/)[0];
    return files[base + clean] ?? files[clean] ?? Object.entries(files).find(([k]) => k.endsWith("/" + clean))?.[1];
  };
  let out = html.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi, (m, h) => { const c = find(h); return c != null ? `<style>${c}</style>` : m; });
  out = out.replace(/<script([^>]*)src=["']([^"']+\.js)["']([^>]*)>\s*<\/script>/gi, (m, a, s, b) => { const c = find(s); return c != null ? `<script${a}${b}>${c.replace(/<\/script>/gi, "<\\/script>")}</script>` : m; });
  return out;
}

export const langOf = (name: string): Lang | null => {
  const e = (name.split(".").pop() || "").toLowerCase();
  return e === "js" || e === "mjs" ? "javascript" : e === "py" ? "python" : e === "html" || e === "htm" ? "html" : null;
};
