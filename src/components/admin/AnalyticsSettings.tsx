import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AnalyticsSettings = () => {
  const { toast } = useToast();
  const [id, setId] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    supabase.from("website_content").select("content").eq("section_key", "ga_measurement_id").maybeSingle().then(({ data }) => setId(data?.content || ""));
  }, []);
  const save = async () => {
    const v = id.trim().toUpperCase();
    if (v && !/^G-[A-Z0-9]{6,}$/.test(v)) return toast({ title: "That is not a Measurement ID", description: "It looks like G-XXXXXXXXXX (not UA- and not a number).", variant: "destructive" });
    setSaving(true);
    const { error } = await supabase.from("website_content").upsert({ section_key: "ga_measurement_id", title: "ga_measurement_id", content: v }, { onConflict: "section_key" });
    setSaving(false);
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Saved", description: "Visitors who accept cookies are now counted in Google Analytics." });
  };
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold text-foreground">Google Analytics</h2>
      <p className="text-sm text-muted-foreground">Paste the Measurement ID of your GA4 web stream (Analytics → Admin → Data streams → your website → Measurement ID, like G-ABC123XYZ4). Visitors, countries, pages and devices then appear in your Google Analytics dashboard. Only visitors who accept the cookie banner are counted.</p>
      <div className="flex flex-wrap gap-2">
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="G-XXXXXXXXXX" className="max-w-xs" />
        <Button onClick={save} disabled={saving}>Save</Button>
        <Button variant="outline" asChild><a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" />Open Google Analytics</a></Button>
      </div>
    </div>
  );
};
export default AnalyticsSettings;
