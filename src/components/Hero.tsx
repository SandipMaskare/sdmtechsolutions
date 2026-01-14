import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const words = ["Innovation", "Technology", "Excellence", "Solutions"];

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-20 overflow-hidden bg-gradient-hero"
    >
      {/* Animated background elements */}
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
              Transforming Ideas Into
              <span className="block mt-2">
                Digital{" "}
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-primary"
                >
                  {words[currentWord]}
                </motion.span>
              </span>
            </h1>

            <p className="text-lg text-secondary-foreground/70 mb-8 max-w-xl leading-relaxed">
              SDM Technology leads the tech sector, delivering refined software
              solutions with advanced development practices. We empower
              businesses to thrive in the digital age with cutting-edge
              technology and innovative solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold px-8 group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 font-semibold px-8"
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
              className="absolute top-10 right-0 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-primary font-display">
                100+
              </div>
              <div className="text-muted-foreground text-sm">
                Projects Completed
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-20 left-0 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-primary font-display">
                50+
              </div>
              <div className="text-muted-foreground text-sm">Happy Clients</div>
            </motion.div>

            {/* Main visual */}
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center border border-primary/20">
              <motion.div
                className="w-48 h-48 bg-primary/30 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-32 h-32 bg-primary/50 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full animate-pulse-glow" />
                </div>
              </motion.div>
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
