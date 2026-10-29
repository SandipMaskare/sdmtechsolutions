import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CharReveal, Typewriter } from "@/components/AnimatedText";
import { DevScene } from "@/components/Illustrations";

const words = ["Websites", "Mobile Apps", "Software", "Cloud Solutions", "Careers"];
const lowMotion = () => typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || (navigator as any).connection?.saveData);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-20 overflow-hidden bg-gradient-hero"
    >
      {/* Looping background video (skipped for reduced motion / data saver) */}
      {!lowMotion() ? (
        <video className="sdm-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/media/poster.jpg" aria-hidden="true">
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
      ) : <img className="sdm-hero-video" src="/media/poster.jpg" alt="" aria-hidden="true" />}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210_60%_12%/.92)] via-[hsl(210_60%_14%/.7)] to-[hsl(210_60%_14%/.35)]" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Follow Your Passion
            </motion.span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-tight font-display mb-6">
              <CharReveal text="Transforming Ideas Into" delay={250} />
              <span className="block mt-2 min-h-[1.2em]">
                Digital <Typewriter phrases={words} className="sdm-gradtext" />
              </span>
            </h1>

            <p className="text-lg text-secondary-foreground/70 mb-8 max-w-xl leading-relaxed">
              SDM Technology is a software company in Gondia, Maharashtra. We
              build websites, web and mobile applications and cloud solutions
              for businesses, and train students through project-based
              internships with mentor review.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="sdm-cta hover:opacity-95 font-semibold px-8 group shadow-lg shadow-teal-500/30"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="bg-transparent border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/15 hover:text-secondary-foreground font-semibold px-8"
              >
                Learn More
                <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Stats cards */}
            <motion.div
              className="absolute top-2 right-0 z-20 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-primary font-display">
                10+
              </div>
              <div className="text-muted-foreground text-sm">
                Projects Delivered
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-6 left-0 z-20 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-primary font-display">
                50+
              </div>
              <div className="text-muted-foreground text-sm">Interns Trained</div>
            </motion.div>

            {/* Main visual */}
            <div className="w-full h-[26rem] flex items-center justify-center px-10">
              <DevScene className="w-full h-full drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
