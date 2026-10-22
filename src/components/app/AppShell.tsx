import { ReactNode } from "react";
import AppTopBar from "@/components/app/AppTopBar";

/** Page frame of the installed app: teal top bar, light grey canvas, room for the tab bar and ad banner. */
export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#f4f7f8]">
    <AppTopBar />
    <main
      className="px-4"
      style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top) + 1rem)", paddingBottom: "calc(6rem + var(--sdm-ad-h, 0px))" }}
    >
      {children}
    </main>
  </div>
);

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-2xl bg-white border border-black/5 shadow-sm ${className}`}>{children}</div>
);

export const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="font-display text-[17px] font-semibold text-foreground mb-3 mt-6">{children}</h3>
);

export const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-block rounded-full bg-[#e6f4f1] text-[#0f766e] text-xs font-medium px-2.5 py-1">{children}</span>
);

export const Spinner = () => (
  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#0f766e] border-t-transparent rounded-full animate-spin" /></div>
);

export const Hero = ({ tag, title, text, grad = "from-[#0b3b4a] via-[#0f766e] to-[#14b8a6]" }: { tag: string; title: string; text?: string; grad?: string }) => (
  <div className={`-mx-4 -mt-4 mb-4 bg-gradient-to-br ${grad} text-white px-6 pt-6 pb-8`}>
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{tag}</span>
    <h2 className="font-display text-[24px] leading-[1.15] font-bold mt-2">{title}</h2>
    {text && <p className="text-sm text-white/85 mt-2">{text}</p>}
  </div>
);
