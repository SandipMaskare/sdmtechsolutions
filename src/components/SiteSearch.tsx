import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Briefcase, BookOpen, Compass, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { articles } from "@/data/articles";
import { services } from "@/data/services";

type Item = { title: string; hint: string; to: string; kind: "Page" | "Service" | "Article" };
const PAGES: Item[] = [
  { title: "Home", hint: "SDM Technology", to: "/", kind: "Page" },
  { title: "About us", hint: "Who we are and how we work", to: "/about", kind: "Page" },
  { title: "Services", hint: "Software, web, mobile, cloud, data", to: "/services", kind: "Page" },
  { title: "Internships", hint: "Apply for a project-based internship", to: "/internships", kind: "Page" },
  { title: "Careers", hint: "Current job openings", to: "/careers", kind: "Page" },
  { title: "Blog and guides", hint: "Articles on software, careers and SEO", to: "/blog", kind: "Page" },
  { title: "Contact", hint: "Phone, email and address", to: "/contact", kind: "Page" },
  { title: "Intern portal login", hint: "For selected interns", to: "/intern/login", kind: "Page" },
  { title: "Employee portal login", hint: "For SDM employees", to: "/employee/login", kind: "Page" },
  { title: "Privacy policy", hint: "How we handle data", to: "/privacy-policy", kind: "Page" },
];
const ICON = { Page: Compass, Service: Briefcase, Article: BookOpen };

const SiteSearch = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo<Item[]>(() => [
    ...PAGES,
    ...services.map((s) => ({ title: s.title, hint: s.description, to: `/services/${s.slug}`, kind: "Service" as const })),
    ...articles.map((a) => ({ title: a.title, hint: a.category, to: `/blog/${a.slug}`, kind: "Article" as const })),
  ], []);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return all.filter((i) => i.kind !== "Article").slice(0, 8);
    const words = t.split(/\s+/);
    return all.map((i) => {
      const hay = `${i.title} ${i.hint}`.toLowerCase();
      const score = words.every((w) => hay.includes(w)) ? (i.title.toLowerCase().includes(t) ? 2 : 1) : 0;
      return { i, score };
    }).filter((x) => x.score).sort((a, b) => b.score - a.score).slice(0, 9).map((x) => x.i);
  }, [q, all]);

  useEffect(() => { setIdx(0); }, [q]);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  const go = (i?: Item) => { if (!i) return; onOpenChange(false); navigate(i.to); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((v) => Math.max(v - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[idx]); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden top-[20%] translate-y-0">
        <DialogTitle className="sr-only">Search the site</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="w-5 h-5 text-primary" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search services, internships, guides…" aria-label="Search the site" className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground" />
          <kbd className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No result for “{q}”. Try “internship”, “web” or “SEO”.</p>}
          {results.map((r, i) => {
            const Icon = ICON[r.kind] || FileText;
            return (
              <button key={r.to} onMouseEnter={() => setIdx(i)} onClick={() => go(r)}
                className={`w-full text-left flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${i === idx ? "bg-primary/10" : ""}`}>
                <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-500 text-white flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-foreground truncate">{r.title}</span><span className="block text-xs text-muted-foreground truncate">{r.hint}</span></span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.kind}</span>
                {i === idx && <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SiteSearch;
