import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Lang } from "@/lib/codeRunner";
import CodeRunner from "./CodeRunner";
import AiCodeChat from "./AiCodeChat";

const SAMPLES: Record<Lang, string> = {
  javascript: "const nums = [3, 1, 2];\nconsole.log('Sorted:', nums.sort());",
  python: "name = input('Name: ') or 'SDM'\nprint('Hello,', name)\nprint(sum(range(1, 11)))",
  html: "<h1>Hello SDM</h1>\n<button onclick=\"this.textContent='Clicked!'\">Click me</button>",
};

/** A small online compiler + AI assistant for testing any code snippet. */
const CodeLab = () => {
  const [lang, setLang] = useState<Lang>("python");
  const [code, setCode] = useState(SAMPLES.python);
  const [output, setOutput] = useState("");
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Code Lab</h2>
        <p className="text-sm text-muted-foreground">Paste or type code to test it, then ask the AI about it. Runs JavaScript, Python and HTML in your browser.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["python", "javascript", "html"] as Lang[]).map((l) => (
              <button key={l} onClick={() => { setLang(l); setCode(SAMPLES[l]); setOutput(""); }} className={`px-3 py-1.5 rounded-full text-sm border capitalize ${lang === l ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{l === "javascript" ? "JavaScript" : l === "html" ? "HTML" : "Python"}</button>
            ))}
          </div>
          <Textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} rows={16} className="font-mono text-xs leading-5" />
          <CodeRunner key={lang} lang={lang} code={code} onResult={setOutput} />
        </div>
        <AiCodeChat code={`// Language: ${lang}\n${code}`} output={output} />
      </div>
    </div>
  );
};
export default CodeLab;
