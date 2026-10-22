import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { articles, getArticle } from "@/data/articles";
import { AppShell, Card, Heading } from "@/components/app/AppShell";
import NotFound from "@/pages/NotFound";

const AppBlogPost = () => {
  const { slug } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound />;
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <AppShell>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0f766e]">{a.category}</span>
      <h2 className="font-display text-[24px] font-bold text-foreground leading-tight mt-1">{a.title}</h2>
      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-3">
        <span>{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readMinutes} min read</span>
      </p>
      <p className="mt-4 text-[15px] text-foreground/90 leading-relaxed">{a.intro}</p>
      {a.sections.map((s) => (
        <section key={s.heading} className="mt-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.heading}</h3>
          {s.paragraphs.map((p, i) => <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{p}</p>)}
          {s.bullets && <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
        </section>
      ))}
      <Card className="p-4 mt-8 bg-[#e6f4f1]">
        <p className="font-semibold text-foreground text-sm">Need help with your project?</p>
        <p className="text-xs text-muted-foreground mt-1">Tell us what you need and we will suggest a practical plan.</p>
        <Link to="/contact" className="mt-3 inline-block rounded-xl bg-[#0f766e] text-white px-4 py-2 text-sm font-semibold">Contact us</Link>
      </Card>
      <Heading>More articles</Heading>
      <Card className="divide-y divide-black/5">
        {more.map((m) => <Link key={m.slug} to={`/blog/${m.slug}`} className="block p-4 text-sm font-medium text-foreground active:bg-black/[0.03]">{m.title}</Link>)}
      </Card>
    </AppShell>
  );
};

export default AppBlogPost;
