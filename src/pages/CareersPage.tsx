import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Careers from "@/components/Careers";
import { motion } from "framer-motion";

const CareersPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Careers
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6 font-display">
                Join Our <span className="text-primary">Team</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                We're building the future of technology. Join us and work on
                exciting projects with a talented team of professionals.
              </p>
            </motion.div>
          </div>
        </section>

        <Careers />
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
