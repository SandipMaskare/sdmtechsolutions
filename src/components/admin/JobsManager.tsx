import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  requirements: string[] | null;
  is_active: boolean;
  created_at: string;
}

const JobsManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch jobs", variant: "destructive" });
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter(r => r.trim()),
    };

    if (editingJob) {
      const { error } = await supabase
        .from("jobs")
        .update(jobData)
        .eq("id", editingJob.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update job", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Job updated successfully" });
        fetchJobs();
      }
    } else {
      const { error } = await supabase.from("jobs").insert(jobData);

      if (error) {
        toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Job created successfully" });
        fetchJobs();
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const toggleActive = async (job: Job) => {
    const { error } = await supabase
      .from("jobs")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update job", variant: "destructive" });
    } else {
      fetchJobs();
    }
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Job deleted successfully" });
      fetchJobs();
    }
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description || "",
      requirements: job.requirements?.join("\n") || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
    });
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Job Postings</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Requirements (one per line)</label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  placeholder="3+ years experience&#10;React proficiency&#10;..."
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingJob ? "Update Job" : "Create Job"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No job postings yet. Click "Add Job" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={!job.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {job.department} • {job.location} • {job.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(job)}>
                        {job.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(job)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {job.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
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

export default JobsManager;
