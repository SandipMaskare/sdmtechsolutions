import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TeamScene } from "@/components/Illustrations";

/** "Build your future with SDM" call to action, inspired by large IT company sites. */
const CareersBand = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-cyan-800 to-indigo-800 text-white p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Build your future with SDM Technology</h2>
          <p className="mt-4 text-white/85 max-w-md">Join a project-based internship or apply for an open role. Work on real software, learn from mentors and earn a certificate you can verify.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/internships" className="inline-flex items-center gap-2 rounded-full bg-white text-teal-800 font-semibold px-6 py-3 hover:shadow-xl hover:-translate-y-0.5 transition-all">Explore internships <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/careers" className="inline-flex items-center gap-2 rounded-full border border-white/60 font-semibold px-6 py-3 hover:bg-white/15 transition-colors">See careers</Link>
          </div>
        </div>
        <div className="relative"><TeamScene className="w-full max-h-72" /></div>
      </div>
    </div>
  </section>
);
export default CareersBand;
