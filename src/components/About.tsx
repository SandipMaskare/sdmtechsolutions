import { motion } from "framer-motion";
import { CheckCircle, Target, Lightbulb, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "We focus on delivering solutions that make a real impact.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Approach",
    description: "Cutting-edge technology meets creative problem-solving.",
  },
  {
    icon: Users,
    title: "Client Focused",
    description: "Your success is our priority at every step.",
  },
];

const checkpoints = [
  "Custom Software Development",
  "Web & Mobile Applications",
  "Cloud Solutions & Integration",
  "24/7 Technical Support",
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 font-display">
              Innovate or Stagnate,
              <span className="text-primary"> Technology</span> Waits for None!
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              SDM Technology leads the tech sector in Gondia, Maharashtra,
              delivering refined software solutions with advanced development
              practices. We specialize in creating innovative digital
              experiences that transform how businesses operate and connect with
              their customers.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With our commitment to excellence, professionalism, and
              innovation, SDM Technology ensures clients confidently navigate
              the ever-evolving tech landscape. Follow your passion with us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {checkpoints.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Features grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
