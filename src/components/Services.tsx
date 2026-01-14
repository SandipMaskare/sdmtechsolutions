import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  Cloud,
  Shield,
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Software Development",
    description:
      "Custom software solutions tailored to your business needs with modern technologies and best practices.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Responsive, fast, and SEO-optimized websites that deliver exceptional user experiences.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android platforms.",
  },
  {
    icon: Database,
    title: "Data & Analytics",
    description:
      "Transform raw data into actionable insights with our analytics solutions.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure and migration services for modern businesses.",
  },
  {
    icon: Shield,
    title: "IT Consulting",
    description:
      "Strategic technology consulting to help you make informed decisions.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 font-display">
            What We <span className="text-primary">Offer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            SDM Technology provides comprehensive technology solutions to help
            your business grow and succeed in the digital landscape.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-display group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
