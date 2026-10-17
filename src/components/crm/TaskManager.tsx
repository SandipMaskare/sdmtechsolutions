import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { statusMeta } from "@/hooks/usePortalTasks";
import { fmtDate } from "@/lib/internProfile";
import { notifyUser, PORTAL_URL } from "@/lib/notify";
import { parseRefs } from "@/data/internshipResources";

const toDateInput = (iso?: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
const blank = { title: "", description: "", deadline: "", priority: "medium", status: "pending", week: "", reference_links: "" };

/** Admin: change deadlines, edit, add custom tasks and delete tasks for one person. */
const TaskManager = ({ person, tasks, onChange }: {
  person: { user_id: string; full_name: string; email?: string; role?: string | null; internship_domain?: string | null };
  tasks: any[];
  onChange: () => void;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [f, setF] = useState<any>(blank);
  const [mail, setMail] = useState(true);
  const set = (k: string, v: string) => setF((x: any) => ({ ...x, [k]: v }));

  const openNew = () => { setEditing(null); setF(blank); setMail(true); setOpen(true); };
  const openEdit = (t: any) => {
    setEditing(t);
    setF({
      title: t.title, description: t.description || "", deadline: toDateInput(t.deadline), priority: t.priority, status: t.status,
      week: t.week ? String(t.week) : "", reference_links: t.reference_links || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!f.title.trim()) return toast({ title: "Enter a task title", variant: "destructive" });
    const deadline = f.deadline ? new Date(`${f.deadline}T18:00:00`).toISOString() : null;
    const row: any = {
      title: f.title.trim(), description: f.description.trim() || null, deadline, priority: f.priority, status: f.status,
      week: f.week ? Number(f.week) : null, reference_links: f.reference_links.trim() || null,
    };
    if (editing) {
      const { error } = await supabase.from("tasks").update(row).eq("id", editing.id);
      if (error) return toast({ title: "Could not save", description: error.message, variant: "destructive" });
      toast({ title: "Task updated" });
    } else {
      const { error } = await supabase.from("tasks").insert({
        ...row, assigned_to: person.user_id, assigned_by: user?.id, task_type: person.role === "employee" ? "task" : "project", domain: person.internship_domain || null,
      });
      if (error) return toast({ title: "Could not add", description: error.message, variant: "destructive" });
      if (mail && person.email) {
        await notifyUser({
          email: person.email, name: person.full_name, template: "tasks",
          subject: `New ${person.role === "employee" ? "task" : "project"} assigned: ${row.title}`,
          lines: [`A new ${person.role === "employee" ? "task" : "project"} has been assigned to you: ${row.title}${deadline ? ` (due ${new Date(deadline).toLocaleDateString("en-IN")})` : ""}.`, ...(row.description ? [row.description] : []), "Please upload your finished work as a single .zip file on the portal."],
          refs: parseRefs(row.reference_links),
          link: { label: "Open my portal", url: person.role === "employee" ? PORTAL_URL.replace("/intern", "/employee") : PORTAL_URL },
        });
      }
      toast({ title: "Task added" });
    }
    setOpen(false);
    onChange();
  };

  const remove = async (t: any) => {
    if (!window.confirm(`Delete "${t.title}"? Any submissions for it are removed too.`)) return;
    await supabase.from("task_submissions").delete().eq("task_id", t.id);
    const { error } = await supabase.from("tasks").delete().eq("id", t.id);
    if (error) return toast({ title: "Could not delete", description: error.message, variant: "destructive" });
    onChange();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" />Add custom task</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Week</TableHead><TableHead>Deadline</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Manage</TableHead></TableRow></TableHeader>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.title}</TableCell>
              <TableCell>{t.week || "—"}</TableCell>
              <TableCell>{fmtDate(t.deadline)}</TableCell>
              <TableCell><Badge className={statusMeta[t.status]?.className}>{statusMeta[t.status]?.label || t.status}</Badge></TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button size="sm" variant="ghost" onClick={() => openEdit(t)} title="Edit / change deadline"><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(t)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tasks.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No tasks assigned yet.</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit task" : `Add a task for ${person.full_name}`}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5"><Label>Title</Label><Input value={f.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Description / instructions</Label><Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Deadline</Label><Input type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Week (optional)</Label><Input type="number" min="1" max="12" value={f.week} onChange={(e) => set("week", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <Select value={f.priority} onValueChange={(v) => set("priority", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["low", "medium", "high", "urgent"].map((x) => <SelectItem key={x} value={x} className="capitalize">{x}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={f.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(statusMeta).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Reference links (one per line: Name | https://link)</Label><Textarea rows={3} value={f.reference_links} onChange={(e) => set("reference_links", e.target.value)} placeholder={"MDN Docs | https://developer.mozilla.org"} /></div>
            {!editing && person.email && (
              <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={mail} onCheckedChange={(v) => setMail(!!v)} />Email them about this task</label>
            )}
            <Button className="w-full" onClick={save}>{editing ? "Save changes" : "Add task"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;
