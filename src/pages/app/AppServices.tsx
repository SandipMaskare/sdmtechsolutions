import { Link } from "react-router-dom";
import { ChevronRight, MessageSquare } from "lucide-react";
import { services } from "@/data/services";
import { AppShell, Card, Hero } from "@/components/app/AppShell";

const AppServices = () => (
  <AppShell>
    <Hero tag="Our services" title="Technology that grows your business" text="End-to-end software, web, mobile, cloud and data solutions." />
    <Card className="divide-y divide-black/5">
      {services.map((s) => (
        <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 p-4 active:bg-black/[0.03]">
          <span className="h-11 w-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center shrink-0"><s.icon className="w-5 h-5 text-[#0f766e]" /></span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
        </Link>
      ))}
    </Card>
    <Link to="/contact" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#0f766e] text-white py-3.5 font-semibold active:scale-[0.98] transition-transform">
      <MessageSquare className="w-5 h-5" /> Get a free quote
    </Link>
  </AppShell>
);

export default AppServices;
