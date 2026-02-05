import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
}

const sectionLabels: Record<string, { label: string; description: string; isTextarea: boolean }> = {
  about_title: { label: "About Section Title", description: "The main title for the About section", isTextarea: false },
  about_description: { label: "About Description", description: "Main description paragraph for the About section", isTextarea: true },
  company_phone: { label: "Company Phone", description: "Contact phone number", isTextarea: false },
  company_email: { label: "Company Email", description: "Contact email address", isTextarea: false },
  company_address: { label: "Company Address", description: "Office address", isTextarea: false },
};

const ContentManager = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .order("section_key");

    if (error) {
      toast({ title: "Error", description: "Failed to fetch content", variant: "destructive" });
    } else {
      setContent(data || []);
      const initial: Record<string, string> = {};
      data?.forEach(item => {
        initial[item.section_key] = item.content || "";
      });
      setEditedContent(initial);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const updates = Object.entries(editedContent).map(async ([key, value]) => {
      return supabase
        .from("website_content")
        .update({ content: value })
        .eq("section_key", key);
    });

    try {
      await Promise.all(updates);
      toast({ title: "Success", description: "Content updated successfully" });
      fetchContent();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
    }
    
    setSaving(false);
  };

  const handleChange = (key: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Website Content</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContent} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {content.map((item) => {
          const sectionInfo = sectionLabels[item.section_key] || { 
            label: item.section_key, 
            description: "", 
            isTextarea: false 
          };
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{sectionInfo.label}</CardTitle>
                  {sectionInfo.description && (
                    <CardDescription>{sectionInfo.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {sectionInfo.isTextarea ? (
                    <Textarea
                      value={editedContent[item.section_key] || ""}
                      onChange={(e) => handleChange(item.section_key, e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      value={editedContent[item.section_key] || ""}
                      onChange={(e) => handleChange(item.section_key, e.target.value)}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {content.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No content found. Content will be added automatically.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManager;
