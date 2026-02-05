import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import TechStack from "@/components/TechStack";
import { motion } from "framer-motion";

const AboutPage = () => {
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6 font-display">
                Empowering Businesses Through{" "}
                <span className="text-primary">Technology</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                SDM Technology is a leading software development company based in
                Gondia, Maharashtra. We specialize in delivering innovative digital
                solutions that help businesses thrive in the modern world.
              </p>
            </motion.div>
          </div>
        </section>

        <About />
        <TechStack />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
