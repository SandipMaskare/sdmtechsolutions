import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import EmailComposer from "./EmailComposer";

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
          <CardTitle className="text-lg">Send an email from sdmtechnologies.pvtltd@gmail.com</CardTitle>
          <CardDescription>Send to anyone straight from the website. Use Gemini to write or polish the message.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailComposer onSent={load} />
        </CardContent>
      </Card>

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
