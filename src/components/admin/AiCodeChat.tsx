import { useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callFunction } from "@/lib/functions";

interface Msg { role: "user" | "assistant"; content: string }

/** AI assistant for the admin: ask about the code, or get a full review with a suggested verdict. */
const AiCodeChat = ({ task, code, output, onFeedback }: { task?: string; code?: string; output?: string; onFeedback?: (t: string) => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const scroll = () => setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const ask = async (payload: any, shown: string) => {
    setBusy(true); setErr(null);
    const next: Msg[] = [...msgs, { role: "user", content: shown }];
    setMsgs(next); scroll();
    const { data, error } = await callFunction<{ text: string; provider: string }>("code-assist", { task, code, output, ...payload, messages: next });
    setBusy(false);
    if (error || !data) { setErr(error || "No answer"); return; }
    setProvider(data.provider);
    setMsgs([...next, { role: "assistant", content: data.text }]); scroll();
  };
  const send = (e: React.FormEvent) => { e.preventDefault(); const t = text.trim(); if (!t || busy) return; setText(""); ask({ action: "chat" }, t); };

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="text-sm font-semibold flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary" /> AI assistant{provider ? ` (${provider})` : ""}</p>
        <Button size="sm" variant="outline" disabled={busy || !code} onClick={() => ask({ action: "review" }, "Review this submission.")}>Review this code</Button>
      </div>
      <div className="p-3 space-y-2 max-h-80 overflow-auto text-sm min-h-[90px]">
        {msgs.length === 0 && <p className="text-muted-foreground text-xs">Press "Review this code" for a full check with a suggested verdict, or ask anything, for example "Why does this print an error?" or "Is this copied?"</p>}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.content}
              {m.role === "assistant" && onFeedback && /feedback message/i.test(m.content) && (
                <button className="mt-2 block text-xs underline" onClick={() => { const f = m.content.split(/6\.\s*Feedback message[^\n]*\n?/i)[1]; onFeedback((f || m.content).trim()); }}>Use as review comment</button>
              )}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Thinking…</p>}
        {err && <p className="text-xs text-destructive">{err}</p>}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-border p-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask the AI about this code…" />
        <Button type="submit" size="icon" disabled={busy || !text.trim()}><Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
};
export default AiCodeChat;
