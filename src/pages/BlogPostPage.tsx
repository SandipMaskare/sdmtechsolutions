import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { articles, getArticle } from "@/data/articles";
import { usePageMeta } from "@/hooks/usePageMeta";

const BlogPostPage = () => {
  const { slug } = useParams();
  const a = getArticle(slug);
  usePageMeta(a ? `${a.title} | SDM Technology` : "Article not found", a?.excerpt);
  if (!a) return <NotFound />;
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"><ArrowLeft className="w-4 h-4" /> All articles</Link>
          <span className="block text-xs font-semibold text-primary uppercase tracking-wider">{a.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 font-display">{a.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>By SDM Technology Team</span>
            <span>{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {a.readMinutes} min read</span>
          </div>
          <p className="text-lg text-foreground/90 leading-relaxed mb-8">{a.intro}</p>
          {a.sections.map((s) => (
            <section key={s.heading} className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-3 font-display">{s.heading}</h2>
              {s.paragraphs.map((p, i) => <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>)}
              {s.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}
          <div className="rounded-2xl bg-accent/40 border border-border p-6 mt-10">
            <p className="font-semibold text-foreground mb-1">Need help with your project?</p>
            <p className="text-muted-foreground text-sm mb-3">Our team in Gondia builds websites, apps and business software. Tell us what you need and we will suggest a practical plan.</p>
            <Link to="/contact" className="text-primary font-medium hover:underline">Contact SDM Technology →</Link>
          </div>
        </article>
        <section className="container mx-auto px-4 max-w-3xl mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4 font-display">More articles</h2>
          <ul className="space-y-2">
            {more.map((m) => <li key={m.slug}><Link className="text-primary hover:underline" to={`/blog/${m.slug}`}>{m.title}</Link></li>)}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
