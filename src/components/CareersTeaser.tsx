import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CareersTeaser = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Join Our Team</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 font-display">
          Build Your <span className="text-primary">Career</span> With Us
        </h2>
        <p className="text-muted-foreground mb-8">
          We're always looking for talented people who share our passion for technology.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 group">
          <Link to="/careers">
            View Careers
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CareersTeaser;
