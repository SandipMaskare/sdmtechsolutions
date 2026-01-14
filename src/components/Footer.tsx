import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import sdmLogo from "@/assets/sdm-logo.jpg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img src={sdmLogo} alt="SDM Technology" className="h-12 mb-4" />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-4">
              Follow Your Passion. SDM Technology leads innovation in software
              development, delivering solutions that transform businesses.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-secondary-foreground font-semibold mb-4 font-display">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-secondary-foreground font-semibold mb-4 font-display">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Web Development",
                "Mobile Apps",
                "Cloud Solutions",
                "IT Consulting",
              ].map((service) => (
                <li key={service}>
                  <span className="text-secondary-foreground/70 text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-secondary-foreground font-semibold mb-4 font-display">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-secondary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Gondia, Maharashtra 441911
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +91 7038523408
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/70 text-sm">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="break-all">sdmtechnologies.pvtltd@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} SDM Technology. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center text-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
