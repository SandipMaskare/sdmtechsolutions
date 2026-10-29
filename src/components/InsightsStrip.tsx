import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { articles } from "@/data/articles";

const GRADS = ["from-teal-500 to-cyan-600", "from-indigo-500 to-violet-600", "from-amber-500 to-rose-500", "from-sky-500 to-blue-600", "from-emerald-500 to-teal-600"];
const hash = (s: string) => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);

/** Latest guides as image-style cards (Infosys-style "Insights"). */
const InsightsStrip = () => (
  <section id="insights" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
        <div>
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 font-display">Latest guides from our team</h2>
        </div>
        <Link to="/blog" className="text-primary font-medium flex items-center gap-1 group">All articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
            <div className={`relative h-40 bg-gradient-to-br ${GRADS[hash(a.category) % GRADS.length]} overflow-hidden`}>
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15 group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute left-6 bottom-4 h-16 w-16 rounded-2xl bg-white/20 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
              <span className="absolute left-4 top-4 text-[11px] font-semibold uppercase tracking-wider text-white bg-black/25 rounded-full px-3 py-1 backdrop-blur">{a.category}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1 line-clamp-3">{a.excerpt}</p>
              <span className="mt-4 text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.readMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
export default InsightsStrip;
