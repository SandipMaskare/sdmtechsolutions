import { Compass, PencilRuler, Code2, Rocket } from "lucide-react";
import { CloudScene, MobileScene } from "@/components/Illustrations";

const STEPS = [
  { icon: Compass, title: "Discover", text: "We listen first: your goals, users and constraints.", c: "from-teal-500 to-cyan-500" },
  { icon: PencilRuler, title: "Design", text: "Scope, timeline and screens agreed before code.", c: "from-sky-500 to-indigo-500" },
  { icon: Code2, title: "Build", text: "Short cycles, regular demos and thorough testing.", c: "from-violet-500 to-fuchsia-500" },
  { icon: Rocket, title: "Launch", text: "Deployment, training and continued support.", c: "from-amber-500 to-rose-500" },
];

const WorkProcess = () => (
  <section id="process" className="py-20 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">How we work</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 font-display">From idea to launch in four clear steps</h2>
      </div>
      <div className="relative grid md:grid-cols-4 gap-6">
        <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-teal-500 via-violet-500 to-rose-500 opacity-40" />
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative text-center group" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className={`mx-auto h-[72px] w-[72px] rounded-2xl bg-gradient-to-br ${s.c} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
              <s.icon className="w-8 h-8" />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">STEP {i + 1}</p>
            <h3 className="font-display font-bold text-lg text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-8 mt-16 items-center">
        <div className="rounded-3xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-border p-6"><CloudScene className="w-full max-h-72" /></div>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">Websites, apps and cloud that work for your customers</h3>
          <p className="text-muted-foreground mt-3">Whether you need a business website, a mobile app or a move to the cloud, we plan it with you, build it in small steps and keep supporting it after launch.</p>
          <div className="mt-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-border p-4 max-w-xs"><MobileScene className="w-full max-h-48" /></div>
        </div>
      </div>
    </div>
  </section>
);
export default WorkProcess;
