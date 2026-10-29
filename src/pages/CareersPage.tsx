import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Careers from "@/components/Careers";
import { motion } from "framer-motion";
import VideoBackdrop from "@/components/VideoBackdrop";

const CareersPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 bg-[hsl(210_60%_12%)]">
          <VideoBackdrop name="waves" />
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-teal-300 font-semibold text-sm uppercase tracking-wider">
                Careers
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-display">
                Join Our <span className="text-teal-300">Team</span>
              </h1>
              <p className="text-white/85 text-lg">
                Join SDM Technology and work on real client and internal projects alongside our team.
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
