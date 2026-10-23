import { useMemo, useState } from "react";
import { ExternalLink, Search, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PortalLayout, { PortalKind } from "@/components/portal/PortalLayout";
import { TOPICS } from "@/data/taskGuide";

// Only third-party learning sites (official docs, free courses). Nothing here points to SDM's own website.
const PortalLearn = ({ kind }: { kind: PortalKind }) => {
  const [q, setQ] = useState("");
  const topics = useMemo(
    () => TOPICS.filter((t) => `${t.name} ${t.refs.map((r) => r.label).join(" ")}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  return (
    <PortalLayout kind={kind}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">Learning Library</h1>
          <p className="text-muted-foreground mt-1">Free official docs and courses from other websites, grouped by topic. Each task also shows the right links inside "Learn &amp; complete this task".</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search a topic, e.g. React, SEO, Figma" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {topics.length === 0 && <p className="text-muted-foreground">Nothing matches. Try another word.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((t) => (
            <Card key={t.key}>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <ul className="space-y-1.5 text-sm">
                  {t.refs.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        {r.label} <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t.name + " tutorial for beginners")}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline inline-flex items-center gap-1">
                      <Youtube className="w-3.5 h-3.5" /> Video tutorials on YouTube
                    </a>
                  </li>
                </ul>
                {t.tips[0] && <p className="text-xs text-muted-foreground">Tip: {t.tips[0]}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default PortalLearn;
