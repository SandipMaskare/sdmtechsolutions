import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, X, Loader2 } from "lucide-react";
import KabirAvatar from "@/components/KabirAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { callFunction } from "@/lib/functions";
import { isAppMode } from "@/lib/appMode";
import { faqAnswer, QUICK } from "@/data/chatFaq";

const linkify = (t: string) =>
  t.split(/(\s\/[a-z-]+|^\/[a-z-]+)/).map((part, i) =>
    /^\s?\/[a-z-]+$/.test(part) ? <a key={i} href={part.trim()} className="underline font-medium">{part}</a> : part);

interface Msg {
  id: string;
  sender: "visitor" | "bot" | "admin";
  body: string;
  created_at: string;
}

const KEY = "sdm_chat_session";
const readSession = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const saveSession = (id: string) => { try { localStorage.setItem(KEY, id); } catch { /* ignore */ } };
const HIDDEN_PREFIXES = ["/admin", "/app/admin", "/crm", "/auth", "/intern/login", "/employee/login", "/enter"];

const ChatWidget = () => {
  const { pathname } = useLocation();
  const [enabled, setEnabled] = useState(true);
  const [welcome, setWelcome] = useState("Hi! 👋 I am Kabir, the SDM Technology assistant. Ask me anything about our services, careers or internships.");
  const [nudge, setNudge] = useState(false);
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(readSession());
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastTs = useRef("1970-01-01T00:00:00Z");

  useEffect(() => {
    supabase
      .from("website_content")
      .select("section_key,content")
      .in("section_key", ["chat_enabled", "chat_welcome_message"])
      .then(({ data }) => {
        (data ?? []).forEach((r) => {
          if (r.section_key === "chat_enabled" && (r.content ?? "").trim().toLowerCase() === "no") setEnabled(false);
          if (r.section_key === "chat_welcome_message" && r.content?.trim() && !/^Hi! 👋 Ask us anything/.test(r.content.trim())) setWelcome(r.content.trim());
        });
      });
  }, []);

  const merge = useCallback((incoming: Msg[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const add = incoming.filter((m) => !seen.has(m.id));
      return add.length ? [...prev, ...add].sort((a, b) => a.created_at.localeCompare(b.created_at)) : prev;
    });
    const newest = incoming.reduce((a, m) => (m.created_at > a ? m.created_at : a), lastTs.current);
    lastTs.current = newest;
  }, []);

  const poll = useCallback(async () => {
    if (!sessionId) return;
    const { data } = await callFunction<{ messages: Msg[] }>("chat-support", {
      action: "poll", session_id: sessionId, since: lastTs.current,
    });
    if (data?.messages) merge(data.messages);
  }, [sessionId, merge]);

  useEffect(() => {
    if (!open || !sessionId) return;
    poll();
    const t = setInterval(poll, 4000);
    return () => clearInterval(t);
  }, [open, sessionId, poll]);

  useEffect(() => {
    const t1 = setTimeout(() => setNudge(true), 4500), t2 = setTimeout(() => setNudge(false), 14000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  if (!enabled || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const send = async (e: React.FormEvent | null, preset?: string) => {
    e?.preventDefault();
    const msg = (preset ?? text).trim();
    if (!msg || sending) return;
    const local = faqAnswer(msg);
    if (local) {
      const now = Date.now();
      setMessages((prev) => [...prev,
        { id: "lv" + now, sender: "visitor", body: msg, created_at: new Date(now).toISOString() },
        { id: "lb" + now, sender: "bot", body: local, created_at: new Date(now + 1).toISOString() }]);
      setText("");
      return;
    }
    setSending(true);
    setError(null);
    const { data, error: err } = await callFunction<{ session_id: string; messages: Msg[] }>("chat-support", {
      action: "send", session_id: sessionId, message: msg, name, email,
    });
    setSending(false);
    if (err || !data) {
      setError(err ?? "Could not send. Please try again.");
      return;
    }
    if (data.session_id && data.session_id !== sessionId) { saveSession(data.session_id); setSessionId(data.session_id); }
    setText("");
    merge(data.messages);
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Kabir"
          style={isAppMode() ? { bottom: "calc(9rem + var(--sdm-ad-h, 0px))" } : undefined}
          className="sdm-chat-in fixed bottom-24 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <KabirAvatar size={40} />
              <div>
                <p className="font-semibold leading-tight">Kabir</p>
                <p className="text-xs opacity-90 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" /> SDM Technology assistant · online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-sm text-foreground shadow-sm">{welcome}</div>
            {!sessionId && (
              <div className="grid gap-2 rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Optional: leave your details so we can follow up.</p>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={100} />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" maxLength={200} />
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`sdm-msg-in ${m.sender === "visitor" ? "flex justify-end" : "flex justify-start"}`}>
                <div
                  className={
                    m.sender === "visitor"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-sm text-foreground shadow-sm"
                  }
                >
                  {m.sender === "admin" && <span className="mb-0.5 block text-xs font-semibold text-primary">SDM Team</span>}
                  {m.sender === "bot" && <span className="mb-0.5 block text-xs font-semibold text-primary">Kabir</span>}
                  {linkify(m.body)}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button key={q} type="button" onClick={() => send(null, q)} className="rounded-full border border-primary/40 bg-card px-3 py-1.5 text-xs text-primary hover:bg-primary/10">{q}</button>
                ))}
              </div>
            )}
            {sending && (
              <div className="flex justify-start"><div className="rounded-2xl rounded-tl-sm bg-card px-3 py-2 shadow-sm flex items-center gap-1" aria-label="Kabir is typing">
                <span className="sdm-dot" /><span className="sdm-dot" style={{ animationDelay: ".15s" }} /><span className="sdm-dot" style={{ animationDelay: ".3s" }} />
              </div></div>
            )}
            <div ref={endRef} />
          </div>

          {error && <p className="bg-destructive/10 px-4 py-2 text-xs text-destructive">{error}</p>}
          <form onSubmit={(e) => send(e)} className="flex gap-2 border-t border-border bg-background p-3">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Kabir anything…" maxLength={1000} aria-label="Message" />
            <Button type="submit" size="icon" disabled={sending || !text.trim()} aria-label="Send">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
      {!open && nudge && (
        <div style={isAppMode() ? { bottom: "calc(8.6rem + var(--sdm-ad-h, 0px))" } : undefined} className="sdm-msg-in fixed bottom-[5.3rem] right-4 z-50 max-w-[220px] rounded-2xl rounded-br-sm bg-card border border-border px-3 py-2 text-sm text-foreground shadow-xl">
          Hi! I'm <b>Kabir</b> 👋 Need help?
          <button onClick={() => setNudge(false)} aria-label="Dismiss" className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs leading-5 text-center">×</button>
        </div>
      )}
      <button
        onClick={() => { setOpen((o) => !o); setNudge(false); }}
        aria-label={open ? "Close chat" : "Chat with Kabir"}
        style={isAppMode() ? { bottom: "calc(5.25rem + var(--sdm-ad-h, 0px))" } : undefined}
        className="sdm-kabir-launch fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-teal-500/40 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6 text-foreground" /> : <KabirAvatar size={48} pulse />}
      </button>
    </>
  );
};

export default ChatWidget;
