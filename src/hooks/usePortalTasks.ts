import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PortalTask {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  task_type: string;
  deadline: string | null;
  created_at: string;
  week?: number | null;
  domain?: string | null;
  reference_links?: string | null;
}

export interface PortalSubmission {
  id: string;
  task_id: string;
  file_url: string | null;
  external_link: string | null;
  comments: string | null;
  submitted_at: string;
  review_status: string | null;
  review_comments: string | null;
}

/** Everything assigned to the signed-in user, plus their own submissions. */
export const usePortalTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PortalTask[]>([]);
  const [submissions, setSubmissions] = useState<PortalSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [t, s] = await Promise.all([
      supabase.from("tasks").select("*").eq("assigned_to", user.id).order("created_at", { ascending: false }),
      supabase.from("task_submissions").select("*").eq("submitted_by", user.id).order("submitted_at", { ascending: false }),
    ]);
    if (t.error || s.error) setError((t.error || s.error)!.message);
    else setError(null);
    setTasks((t.data as PortalTask[]) || []);
    setSubmissions((s.data as PortalSubmission[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, submissions, loading, error, refresh };
};

export const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "To do", className: "bg-slate-500" },
  in_progress: { label: "In progress", className: "bg-blue-500" },
  submitted: { label: "Submitted", className: "bg-purple-500" },
  approved: { label: "Approved", className: "bg-green-600" },
  rejected: { label: "Needs changes", className: "bg-red-500" },
};

export const priorityMeta: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};
