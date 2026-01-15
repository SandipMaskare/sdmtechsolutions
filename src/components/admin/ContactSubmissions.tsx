import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch submissions", variant: "destructive" });
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const toggleRead = async (submission: ContactSubmission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !submission.is_read })
      .eq("id", submission.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update submission", variant: "destructive" });
    } else {
      fetchSubmissions();
    }
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete submission", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Submission deleted successfully" });
      fetchSubmissions();
    }
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Contact Submissions</h2>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-primary">{unreadCount} new</Badge>
          )}
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No contact submissions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${!submission.is_read ? "border-primary/50 bg-primary/5" : ""}`}
                onClick={() => {
                  setExpandedId(expandedId === submission.id ? null : submission.id);
                  if (!submission.is_read) {
                    toggleRead(submission);
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {submission.is_read ? (
                          <MailOpen className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Mail className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{submission.subject}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          From: {submission.name} ({submission.email})
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(submission.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => toggleRead(submission)}>
                        {submission.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteSubmission(submission.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedId === submission.id && (
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-4 mt-2">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{submission.message}</p>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}>
                          Reply via Email
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
