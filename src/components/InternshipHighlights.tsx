import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, ClipboardCheck, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  { icon: GraduationCap, title: "Real project work", text: "Work on projects assigned to you, not just lectures." },
  { icon: ClipboardCheck, title: "Your own intern portal", text: "See your projects and submit work online, from anywhere." },
  { icon: MessageSquare, title: "Feedback from the team", text: "Every submission is reviewed and you get comments back." },
];

const InternshipHighlights = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Internships</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 font-display">
          Start your career with <span className="text-primary">SDM Technology</span>
        </h2>
        <p className="text-muted-foreground">Short internships for students and freshers. Apply in minutes.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {points.map((p) => (
          <div key={p.title} className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-accent mx-auto flex items-center justify-center mb-4">
              <p.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 font-display">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button asChild size="lg" className="font-semibold px-8 group">
          <Link to="/internships">
            Apply for an Internship
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default InternshipHighlights;
