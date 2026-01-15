import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch testimonials", variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTestimonial) {
      const { error } = await supabase
        .from("testimonials")
        .update(formData)
        .eq("id", editingTestimonial.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update testimonial", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Testimonial updated successfully" });
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert(formData);

      if (error) {
        toast({ title: "Error", description: "Failed to create testimonial", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Testimonial created successfully" });
        fetchTestimonials();
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const toggleActive = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_active: !testimonial.is_active })
      .eq("id", testimonial.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update testimonial", variant: "destructive" });
    } else {
      fetchTestimonials();
    }
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({ name: "", role: "", company: "", content: "", rating: 5 });
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No testimonials yet. Click "Add Testimonial" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={!testimonial.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(testimonial)}>
                        {testimonial.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(testimonial)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(testimonial.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
