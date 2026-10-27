import { Link } from "react-router-dom";
import { Target, Lightbulb, Users, CheckCircle2, MapPin } from "lucide-react";
import { AppShell, Card, Heading, Hero } from "@/components/app/AppShell";

const values = [
  { icon: Target, t: "Mission driven", d: "We focus on delivering solutions that make a real impact." },
  { icon: Lightbulb, t: "Innovative approach", d: "Modern technology meets creative problem-solving." },
  { icon: Users, t: "Client focused", d: "Your success is our priority at every step." },
];
const points = ["Custom software development", "Web and mobile applications", "Cloud solutions and integration", "Reliable technical support"];
const stats = [{ v: "100+", l: "Projects" }, { v: "50+", l: "Clients" }, { v: "5+", l: "Years" }, { v: "15+", l: "Experts" }];

const AppAbout = () => (
  <AppShell>
    <Hero tag="About us" title="Empowering businesses through technology" text="SDM Technology is a software development company based in Gondia, Maharashtra." />
    <Card className="grid grid-cols-4 py-3.5">
      {stats.map((x, i) => (
        <div key={x.l} className={`text-center ${i > 0 ? "border-l border-black/5" : ""}`}><p className="font-display text-lg font-bold text-[#0f766e]">{x.v}</p><p className="text-[11px] text-muted-foreground">{x.l}</p></div>
      ))}
    </Card>
    <Heading>What we stand for</Heading>
    <Card className="divide-y divide-black/5">
      {values.map((v) => (
        <div key={v.t} className="flex gap-3 p-4"><span className="h-10 w-10 rounded-xl bg-[#e6f4f1] flex items-center justify-center shrink-0"><v.icon className="w-5 h-5 text-[#0f766e]" /></span><div><p className="text-sm font-semibold text-foreground">{v.t}</p><p className="text-xs text-muted-foreground mt-0.5">{v.d}</p></div></div>
      ))}
    </Card>
    <Heading>What we do</Heading>
    <Card className="p-4 space-y-3">
      {points.map((p) => <div key={p} className="flex gap-3 text-sm text-foreground/90"><CheckCircle2 className="w-5 h-5 text-[#0f766e] shrink-0" />{p}</div>)}
    </Card>
    <Card className="p-4 mt-4 flex items-center gap-3"><MapPin className="w-5 h-5 text-[#0f766e]" /><span className="text-sm text-foreground">Ward No. 3, Laxmi Chowk, Old Bus Stop, Murdada, Gondia, Maharashtra – 441911</span></Card>
    <Link to="/contact" className="mt-4 block text-center rounded-2xl bg-[#0f766e] text-white py-3.5 font-semibold active:scale-[0.98] transition-transform">Talk to us</Link>
  </AppShell>
);

export default AppAbout;
