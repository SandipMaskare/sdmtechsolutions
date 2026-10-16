import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { usePageMeta } from "@/hooks/usePageMeta";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const BlogPage = () => {
  usePageMeta("Insights & Guides | SDM Technology", "Practical guides on software development, web and mobile apps, cloud, internships and careers from the SDM Technology team in Gondia.");
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Insights</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-5 font-display">Guides for Businesses, Students and Developers</h1>
            <p className="text-muted-foreground text-lg">
              Practical, plain-language articles from the SDM Technology team on software, web and mobile development, cloud, internships and careers.
            </p>
          </div>
        </section>
        <section className="py-14">
          <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow flex flex-col">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{a.category}</span>
                <h2 className="text-xl font-bold text-foreground mt-2 mb-3 font-display group-hover:text-primary transition-colors">{a.title}</h2>
                <p className="text-muted-foreground text-sm flex-1">{a.excerpt}</p>
                <div className="flex items-center justify-between mt-5 text-xs text-muted-foreground">
                  <span>{fmt(a.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.readMinutes} min read</span>
                </div>
                <span className="mt-4 text-primary text-sm font-medium flex items-center gap-1">Read article <ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
