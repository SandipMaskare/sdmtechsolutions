import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();

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
                Our Services
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6 font-display">
                Comprehensive IT{" "}
                <span className="text-primary">Solutions</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                From custom software development to cloud solutions, we provide
                end-to-end technology services tailored to your business needs.
              </p>
              <Button
                onClick={() => navigate("/contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 group"
              >
                Get a Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        <Services />

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary/10 to-accent border border-primary/20"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
                Ready to Transform Your Business?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Let's discuss how our services can help you achieve your business
                goals. Get in touch with our team today.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 group"
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
