import { Link, useParams } from "react-router-dom";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { getService, services } from "@/data/services";
import { AppShell, Card, Chip, Heading } from "@/components/app/AppShell";
import NotFound from "@/pages/NotFound";

const AppServiceDetail = () => {
  const { slug } = useParams();
  const s = getService(slug);
  if (!s) return <NotFound />;
  const others = services.filter((x) => x.slug !== s.slug);
  return (
    <AppShell>
      <Card className="p-5">
        <span className="h-14 w-14 rounded-2xl bg-[#e6f4f1] flex items-center justify-center mb-4"><s.icon className="w-7 h-7 text-[#0f766e]" /></span>
        <h2 className="font-display text-[22px] font-bold text-foreground leading-tight">{s.title}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.overview}</p>
        <Link to="/contact" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] text-white py-3 font-semibold active:scale-[0.98] transition-transform">
          <MessageSquare className="w-5 h-5" /> Get a quote
        </Link>
      </Card>

      <Heading>What you get</Heading>
      <Card className="p-4 space-y-3">
        {s.features.map((f) => (
          <div key={f} className="flex gap-3 text-sm text-foreground/90"><CheckCircle2 className="w-5 h-5 text-[#0f766e] shrink-0 mt-0.5" />{f}</div>
        ))}
      </Card>

      <Heading>Technologies</Heading>
      <div className="flex flex-wrap gap-2">{s.technologies.map((t) => <Chip key={t}>{t}</Chip>)}</div>

      <Heading>How we work</Heading>
      <Card className="p-4 space-y-4">
        {s.process.map((p, i) => (
          <div key={p.title} className="flex gap-3">
            <span className="h-7 w-7 shrink-0 rounded-full bg-[#0f766e] text-white text-sm font-semibold flex items-center justify-center">{i + 1}</span>
            <div><p className="text-sm font-semibold text-foreground">{p.title}</p><p className="text-xs text-muted-foreground mt-0.5">{p.text}</p></div>
          </div>
        ))}
      </Card>

      <Heading>Other services</Heading>
      <Card className="divide-y divide-black/5">
        {others.map((o) => (
          <Link key={o.slug} to={`/services/${o.slug}`} className="flex items-center gap-3 p-3.5 active:bg-black/[0.03]">
            <o.icon className="w-5 h-5 text-[#0f766e]" /><span className="text-sm font-medium text-foreground">{o.title}</span>
          </Link>
        ))}
      </Card>
    </AppShell>
  );
};

export default AppServiceDetail;
