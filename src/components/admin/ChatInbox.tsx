import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  last_message_at: string;
  admin_unread: boolean;
  human_takeover: boolean;
}
interface Msg { id: string; sender: "visitor" | "bot" | "admin"; body: string; created_at: string }

const db = supabase as any;

const ChatInbox = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    const { data } = await db.from("chat_sessions").select("*").order("last_message_at", { ascending: false }).limit(100);
    setSessions((data as Session[]) ?? []);
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    const { data } = await db.from("chat_messages").select("id,sender,body,created_at").eq("session_id", id).order("created_at");
    setMessages((data as Msg[]) ?? []);
  }, []);

  useEffect(() => {
    loadSessions();
    const t = setInterval(() => { loadSessions(); if (activeId) loadMessages(activeId); }, 5000);
    return () => clearInterval(t);
  }, [loadSessions, loadMessages, activeId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const open = async (s: Session) => {
    setActiveId(s.id);
    await loadMessages(s.id);
    if (s.admin_unread) {
      await db.from("chat_sessions").update({ admin_unread: false }).eq("id", s.id);
      loadSessions();
    }
  };

  const active = sessions.find((s) => s.id === activeId) ?? null;

  const reply = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !activeId) return;
    const { error } = await db.from("chat_messages").insert({ session_id: activeId, sender: "admin", body });
    if (error) return toast({ title: "Could not send", description: error.message, variant: "destructive" });
    await db.from("chat_sessions").update({ human_takeover: true, admin_unread: false, last_message_at: new Date().toISOString() }).eq("id", activeId);
    setText("");
    loadMessages(activeId);
    loadSessions();
  };

  const toggleAi = async () => {
    if (!active) return;
    await db.from("chat_sessions").update({ human_takeover: !active.human_takeover }).eq("id", active.id);
    loadSessions();
  };

  const remove = async () => {
    if (!active) return;
    await db.from("chat_sessions").delete().eq("id", active.id);
    setActiveId(null);
    setMessages([]);
    loadSessions();
  };

  const label = (s: Session) => s.visitor_name || s.visitor_email || `Visitor ${s.id.slice(0, 4)}`;
  const unread = sessions.filter((s) => s.admin_unread).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">Chat Support</h2>
        {unread > 0 && <Badge className="bg-primary">{unread} new</Badge>}
      </div>
      <p className="text-sm text-muted-foreground">
        Visitors chat from the website. Gemini answers automatically until you reply here — then it stays quiet so you can talk to the visitor yourself.
      </p>
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-0 max-h-[560px] overflow-y-auto divide-y divide-border">
            {sessions.length === 0 && <p className="p-4 text-sm text-muted-foreground">No chats yet.</p>}
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => open(s)}
                className={`w-full text-left p-3 hover:bg-accent/50 ${activeId === s.id ? "bg-accent" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground truncate">{label(s)}</span>
                  {s.admin_unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.last_message_at).toLocaleString()} · {s.human_takeover ? "You" : "AI"}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex flex-col h-[560px]">
            {!active ? (
              <p className="m-auto text-sm text-muted-foreground">Select a chat to read and reply.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{label(active)}</p>
                    {active.visitor_email && <p className="text-xs text-muted-foreground">{active.visitor_email}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={toggleAi}>
                      {active.human_takeover ? <><Bot className="w-4 h-4 mr-1" /> Let AI answer</> : <><UserRound className="w-4 h-4 mr-1" /> I'll answer</>}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={remove} aria-label="Delete chat"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 p-4 bg-muted/30">
                  {messages.map((m) => (
                    <div key={m.id} className={m.sender === "visitor" ? "flex justify-start" : "flex justify-end"}>
                      <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                        m.sender === "visitor" ? "bg-card text-foreground shadow-sm" : m.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }`}>
                        <span className="block text-[10px] uppercase tracking-wide opacity-70">{m.sender === "visitor" ? "Visitor" : m.sender === "admin" ? "You" : "AI"}</span>
                        {m.body}
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <form onSubmit={reply} className="flex gap-2 border-t border-border p-3">
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your reply…" />
                  <Button type="submit" disabled={!text.trim()}><Send className="w-4 h-4" /></Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInbox;
