import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { articles } from "@/data/articles";
import { AppShell, Card, Hero } from "@/components/app/AppShell";

const AppBlog = () => (
  <AppShell>
    <Hero tag="Insights" title="Guides from the SDM team" text="Practical articles on software, web, apps, cloud, internships and careers." />
    <div className="space-y-3">
      {articles.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="block active:scale-[0.99] transition-transform">
          <Card className="p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0f766e]">{a.category}</span>
            <p className="font-display font-semibold text-foreground mt-1 leading-snug">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{a.excerpt}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readMinutes} min read</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  </AppShell>
);

export default AppBlog;
