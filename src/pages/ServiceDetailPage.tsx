import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getService, services } from "@/data/services";
import NotFound from "./NotFound";

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getService(slug);

  if (!service) return <NotFound />;
  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> All services
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">{service.title}</h1>
              <p className="text-lg text-muted-foreground">{service.overview}</p>
              <Button onClick={() => navigate("/contact")} className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 group">
                Get a Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-display">What you get</h2>
              <ul className="space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 font-display">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-display">How we work</h2>
              <ol className="space-y-5">
                {service.process.map((p, i) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-muted-foreground text-sm">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-display">Other services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {others.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all flex items-center gap-4">
                  <s.icon className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{s.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
