import { motion } from "framer-motion";
import { Award, Clock, Headphones, Zap, Shield, TrendingUp } from "lucide-react";

const reasons = [
  { icon: Award, title: "Mentor-led team", description: "Projects are planned and reviewed by experienced developers and mentors, and interns work under their guidance.", stat: "Mentored", statLabel: "Reviews" },
  { icon: Clock, title: "Clear timelines", description: "We agree scope, milestones and dates before work starts and tell you early if anything changes.", stat: "Planned", statLabel: "Milestones" },
  { icon: Headphones, title: "Responsive support", description: "Reach us Monday to Saturday, 9:00 to 18:00 by phone, email or the chat assistant, and we reply promptly.", stat: "Mon-Sat", statLabel: "9:00-18:00" },
  { icon: Zap, title: "Step-by-step delivery", description: "We build in short cycles and show progress often, so you can adjust before it becomes costly.", stat: "Agile", statLabel: "Cycles" },
  { icon: Shield, title: "Security basics built in", description: "Sign-in protection, access control and sensible data handling are part of every project.", stat: "Secure", statLabel: "By design" },
  { icon: TrendingUp, title: "Room to grow", description: "We choose tools that let your product grow with your business instead of being rebuilt later.", stat: "Scalable", statLabel: "Choices" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mt-3 mb-4 font-display">
            The <span className="text-primary">SDM</span> Advantage
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            How we work with clients and what you can expect when you build with SDM Technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group p-8 rounded-2xl bg-card/10 backdrop-blur-sm border border-primary/20 hover:border-primary/50 hover:bg-card/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center"
                >
                  <reason.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary font-display">{reason.stat}</div>
                  <div className="text-xs text-secondary-foreground/60">{reason.statLabel}</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-foreground mb-3 font-display group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-secondary-foreground/70 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
