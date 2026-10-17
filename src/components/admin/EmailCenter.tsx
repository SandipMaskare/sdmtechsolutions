import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EmailComposer from "./EmailComposer";

/** Links and names that appear in the footer of every branded email. */
const BrandSettings = () => {
  const { toast } = useToast();
  const [f, setF] = useState({ community_url: "", mentor_name: "Mr. Kabir Maskare", contact_email: "sdmtechnologies.pvtltd@gmail.com" });
  useEffect(() => {
    (supabase as any).from("website_content").select("metadata").eq("section_key", "brand_links").maybeSingle().then(({ data }: any) => {
      if (data?.metadata) setF((x) => ({ ...x, ...data.metadata }));
    });
  }, []);
  const save = async () => {
    const { error } = await (supabase as any).from("website_content").upsert({ section_key: "brand_links", title: "Email branding", metadata: f }, { onConflict: "section_key" });
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Email branding saved" });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email branding</CardTitle>
        <CardDescription>Shown in every branded email: logo and social links are built in; set the community link, mentor and contact here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Community link (WhatsApp / Telegram / Discord)</Label><Input value={f.community_url} onChange={(e) => setF({ ...f, community_url: e.target.value })} placeholder="https://chat.whatsapp.com/..." /></div>
          <div><Label>Internship mentor name</Label><Input value={f.mentor_name} onChange={(e) => setF({ ...f, mentor_name: e.target.value })} /></div>
          <div><Label>Contact email</Label><Input value={f.contact_email} onChange={(e) => setF({ ...f, contact_email: e.target.value })} /></div>
        </div>
        <p className="text-xs text-muted-foreground">Leave the community link empty to hide the "Join our community" block.</p>
        <Button onClick={save}>Save branding</Button>
      </CardContent>
    </Card>
  );
};

interface LogRow {
  id: string;
  to_emails: string[];
  subject: string;
  status: string;
  error: string | null;
  created_at: string;
}

const EmailCenter = () => {
  const [rows, setRows] = useState<LogRow[]>([]);

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("email_log")
      .select("id,to_emails,subject,status,error,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setRows((data as LogRow[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Email</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send an email from your company mailbox</CardTitle>
          <CardDescription>Send to anyone straight from the website. Use Gemini to write or polish the message.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailComposer onSent={load} />
        </CardContent>
      </Card>

      <BrandSettings />

      <Card>
        <CardHeader><CardTitle className="text-lg">Recently sent</CardTitle></CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing sent yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="py-3 flex items-start gap-3">
                  {r.status === "sent"
                    ? <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 shrink-0" />
                    : <XCircle className="w-4 h-4 mt-1 text-destructive shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{r.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">To: {r.to_emails.join(", ")}</p>
                    {r.error && <p className="text-xs text-destructive">{r.error}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCenter;
