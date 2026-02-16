import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Users, Rocket, Heart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import JobApplicationDialog from "@/components/JobApplicationDialog";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  requirements: string[] | null;
}

const fallbackJobs = [
  {
    id: "1",
    title: "Full Stack Developer",
    type: "Full-time",
    department: "Engineering",
    location: "Gondia, Maharashtra",
    description: "Build scalable web applications using React, Node.js, and modern technologies.",
    requirements: null,
  },
  {
    id: "2",
    title: "Mobile App Developer",
    type: "Full-time",
    department: "Engineering",
    location: "Remote / Hybrid",
    description: "Develop cross-platform mobile applications using React Native or Flutter.",
    requirements: null,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    type: "Full-time",
    department: "Design",
    location: "Gondia, Maharashtra",
    description: "Create stunning user interfaces and seamless user experiences for our clients.",
    requirements: null,
  },
];

const benefits = [
  {
    icon: Rocket,
    title: "Career Growth",
    description: "Continuous learning opportunities and clear career progression paths.",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Comprehensive health insurance for you and your family.",
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Collaborative environment with talented and passionate colleagues.",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "Annual budget for courses, certifications, and conferences.",
  },
];

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setJobs(data);
    }
    setLoading(false);
  };

  const handleApply = (job: Job) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setApplyJob(job);
  };

  return (
    <section id="careers" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Join Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 font-display">
            Build Your <span className="text-primary">Career</span> With Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join SDM Technology and be part of a team that's shaping the future of technology. 
            We're always looking for talented individuals who share our passion for innovation.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <motion.div 
                className="w-14 h-14 mx-auto rounded-xl bg-accent flex items-center justify-center mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <benefit.icon className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-foreground mb-2 font-display">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Job Openings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8 font-display text-center">
            Current <span className="text-primary">Openings</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No open positions at the moment. Check back soon!
            </p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold text-foreground font-display group-hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                      </div>
                      {job.description && (
                        <p className="text-muted-foreground mb-3">{job.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-primary" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary" />
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
                          {job.department}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleApply(job)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group/btn shrink-0"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-accent border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-3 font-display">
            Don't See Your Role?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 group"
          >
            Send Your Resume
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {applyJob && (
        <JobApplicationDialog
          open={!!applyJob}
          onOpenChange={(open) => !open && setApplyJob(null)}
          jobId={applyJob.id}
          jobTitle={applyJob.title}
        />
      )}
    </section>
  );
};

export default Careers;
