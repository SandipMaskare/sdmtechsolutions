import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
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
  const [welcome, setWelcome] = useState("Hi! 👋 Ask us anything about our services, careers or internships.");
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
          if (r.section_key === "chat_welcome_message" && r.content?.trim()) setWelcome(r.content.trim());
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
          aria-label="Chat support"
          style={isAppMode() ? { bottom: "calc(9rem + var(--sdm-ad-h, 0px))" } : undefined}
          className="fixed bottom-24 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-semibold leading-tight">SDM Technology Support</p>
              <p className="text-xs opacity-90">We usually reply within a few minutes</p>
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
              <div key={m.id} className={m.sender === "visitor" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.sender === "visitor"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-sm text-foreground shadow-sm"
                  }
                >
                  {m.sender === "admin" && <span className="mb-0.5 block text-xs font-semibold text-primary">SDM Team</span>}
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
            <div ref={endRef} />
          </div>

          {error && <p className="bg-destructive/10 px-4 py-2 text-xs text-destructive">{error}</p>}
          <form onSubmit={(e) => send(e)} className="flex gap-2 border-t border-border bg-background p-3">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message…" maxLength={1000} aria-label="Message" />
            <Button type="submit" size="icon" disabled={sending || !text.trim()} aria-label="Send">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat support"}
        style={isAppMode() ? { bottom: "calc(5.25rem + var(--sdm-ad-h, 0px))" } : undefined}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

export default ChatWidget;
