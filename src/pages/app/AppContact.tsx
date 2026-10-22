import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppShell, Card, Heading } from "@/components/app/AppShell";

const input = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[15px] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20";

const AppContact = () => {
  const { toast } = useToast();
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) return toast({ title: "Please fill in your name, email and message", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert({ name: f.name, email: f.email, subject: f.subject, message: f.message });
    setBusy(false);
    if (error) return toast({ title: "Could not send", description: "Please try again.", variant: "destructive" });
    toast({ title: "Message sent", description: "We will get back to you soon." });
    supabase.functions.invoke("send-email", { body: { type: "contact", name: f.name, email: f.email, message: `${f.subject}\n\n${f.message}` } }).catch(() => undefined);
    setF({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:+917038523408" className="rounded-2xl bg-[#0f766e] text-white p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"><Phone className="w-5 h-5" /><div><p className="text-sm font-semibold">Call us</p><p className="text-[11px] text-white/80">+91 70385 23408</p></div></a>
        <a href="mailto:sdmtechnologies.pvtltd@gmail.com" className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"><Mail className="w-5 h-5 text-[#0f766e]" /><div><p className="text-sm font-semibold text-foreground">Email us</p><p className="text-[11px] text-muted-foreground">Reply in 1 day</p></div></a>
      </div>
      <Card className="p-4 mt-3 flex items-center gap-3"><MapPin className="w-5 h-5 text-[#0f766e]" /><span className="text-sm text-foreground">Gondia, Maharashtra 441911</span></Card>
      <Heading>Send us a message</Heading>
      <Card className="p-4">
        <form onSubmit={submit} className="space-y-3">
          <input className={input} placeholder="Your name" value={f.name} onChange={set("name")} autoComplete="name" />
          <input className={input} type="email" placeholder="Email" value={f.email} onChange={set("email")} autoComplete="email" />
          <input className={input} placeholder="Subject" value={f.subject} onChange={set("subject")} />
          <textarea className={`${input} min-h-[120px]`} placeholder="How can we help?" value={f.message} onChange={set("message")} />
          <button disabled={busy} className="w-full rounded-xl bg-[#0f766e] text-white py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-transform"><Send className="w-4 h-4" />{busy ? "Sending..." : "Send message"}</button>
        </form>
      </Card>
    </AppShell>
  );
};

export default AppContact;
